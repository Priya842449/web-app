define(['angular', './sample-module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('surveyreportsCtrl', ['$state', '$timeout', '$scope', '$compile', '$log', 'PredixAssetService', 'PredixViewService', 'commonServices', function($state, $timeout, $scope, $compile, $log, PredixAssetService, PredixViewService, commonServices) {


        var urlPathArr = [];
        urlPathArr.push($state.current.name);
   var ssoObj = window.localStorage.getItem("SSO_ID");
        const ssoPrivilegeData = {
            contractorId: ssoObj
        };

        function privilegeAccess() {
            commonServices.getPrivilegeData(ssoPrivilegeData).then(function(privilege_Data) {
                console.log(ssoPrivilegeData, privilege_Data);
                let privilegeData = privilege_Data.data;
                console.log(privilegeData);
                angular.forEach(privilegeData, function(objTmp) {
                    if (urlPathArr.indexOf(objTmp.state) >= 0) {
                        $scope.isReadonly = (objTmp.access_id == 2) ? true : false;
                    }
                });
                console.log("privilegeAccess----", privilegeData);
                console.log($scope.isReadonly);
            });
        }
        privilegeAccess();

        $scope.overview = true;
        $scope.summary = false;

        $scope.hideShowFun = function() {
                $scope.overview = false;
                $scope.summary = true;
            }
            /*chartconfig - Monthly Average report starts*/
        var d = new Date();
        var n = d.getMonth();
        $scope.chartSeries = [{
                name: 'Installed',
                color: '#90ed7d',
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                pointStart: Date.UTC(2016, n, 1),
                pointInterval: 24 * 3600 * 1000 // one day
            },
            {
                name: 'Service',
                color: '#f7a35c',
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                pointStart: Date.UTC(2016, n, 1),
                pointInterval: 24 * 3600 * 1000 // one day
            }
        ];

        $scope.chartConfig = {
            options: {
                chart: {
                    type: 'line'
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                tooltip: {
                    dateTimeLabelFormats: {
                        millisecond: "%A, %b %e, %H:%M:%S.%L",
                        second: "%A, %b %e, %H:%M:%S",
                        minute: "%A, %b %e, %H:%M",
                        hour: "%A, %b %e, %H:%M",
                        day: "%A, %b %e, %Y",
                        week: "%m-%d-%Y",
                        month: "%B %Y",
                        year: "%Y"
                    }
                },
            },
            series: $scope.chartSeries,
            title: {
                text: 'Installation per Day Over the Month',
                style: {
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    fontFamily: 'GE Inspira Sans, sans-serif'
                }
            },
            xAxis: {
                title: {
                    text: 'June'
                },
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%e of %b'
                }
            },
            yAxis: {
                title: {
                    text: 'Asset Count'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            credits: {
                enabled: false
            },
            loading: false,
            size: {}
        }

        $scope.reflow = function() {
            $scope.$broadcast('highchartsng.reflow');
        };
        /*chartconfig - Monthly Average report ends*/

        /*chartconfig 5 - site assets starts*/

        $scope.chartSeries = [{

                name: 'Installation Count',
                color: '#46ad00',
                data: [225, 403, 635, 831, 1007]
            }, {

                name: 'Avg Installation Time',
                color: '#f7a35c',
                yAxis: 1,
                data: [153200, 353200, 553200, 753200, 953200],
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        var time = this.y1;
                        var hours1 = parseInt(time / 3600000);
                        var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                        return hours1 + 'h :' + mins1 + 'm';

                    }
                }
            }

        ];

        $scope.chartConfig5 = {
            options: {
                chart: {
                    type: 'column'
                },

                plotOptions: {
                    column: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    enabled: true
                },
                tooltip: {
                    formatter: function() {
                        if (this.series.name == "Installation Count") {
                            return "<b>" + this.series.name + "</b><br>" + this.x + " - " + this.y;
                        } else {
                            var time = this.y;
                            var hours1 = parseInt(time / 3600000);
                            var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                            return "<b>" + this.series.name + "</b><br>" + this.x + " - " + hours1 + " h: " + mins1 + " m";
                            //return this.key + '<br>Installation Time - <b>' + hours1 + 'h :' + mins1 + 'm</b>';
                        }
                    }

                },
            },
            series: $scope.chartSeries,
            title: {
                text: 'Number of Installation by User',
                style: {
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    fontFamily: 'GE Inspira Sans, sans-serif'
                }
            },
            subtitle: {
                text: 'Total Assets - 5700'
            },
            xAxis: {
                title: {
                    text: 'Resources'
                },
                categories: ['502342435', '320003386', '212328493', '502627292', '501234578']
            },
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                title: {
                    text: 'Asset Count',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                opposite: true

            }, { // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: 'Avg Installation Time',
                    style: {
                        color: Highcharts.getOptions().colors[3]
                    }
                },
                labels: {
                    style: {
                        color: Highcharts.getOptions().colors[3]
                    },
                    formatter: function() {
                        var time = this.value;
                        var hours1 = parseInt(time / 3600000);
                        var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                        return hours1 + ':' + mins1;
                    }
                }

            }],


            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                shadow: true
            },
            credits: {
                enabled: false
            },
            loading: false,
            size: {}
        }

        $scope.reflow = function() {
            $scope.$broadcast('highchartsng.reflow');
        };

        /*chartconfig 5 - site assets end*/

        /*chartconfig 3 - site utlization starts*/
        var d = new Date();
        var n = d.getFullYear();
        $scope.chartSeries = [
            { name: 'Installed', color: '#f15c80', data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 23.3, 18.3, 13.9, 9.6, 12.5] },
            { name: 'Service', color: '#e4d354', data: [17.0, 16.9, 29.5, 24.5, 38.2, 71.5, 55.2, 93.3, 28.3, 53.9, 29.6, 52.5] }
        ];
        $scope.chartConfig3 = {
            options: {
                chart: {
                    type: 'spline'
                },
                plotOptions: {
                    spline: {
                        marker: {
                            radius: 4,
                            lineColor: '#666666',
                            lineWidth: 1
                        }
                    }
                },
                tooltip: {
                    dateTimeLabelFormats: {
                        millisecond: "%A, %b %e, %H:%M:%S.%L",
                        second: "%A, %b %e, %H:%M:%S",
                        minute: "%A, %b %e, %H:%M",
                        hour: "%A, %b %e, %H:%M",
                        day: "%A, %b %e, %Y",
                        week: "%m-%d-%Y",
                        month: "%B %Y",
                        year: "%Y"
                    }
                }
            },
            series: $scope.chartSeries,
            title: {
                text: 'Installation per Month Over the Year'
            },
            //new Date().getFullYear()
            // returns the current year
            xAxis: {
                title: {
                    text: n
                },
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ]

            },
            yAxis: {
                title: {
                    text: 'Asset Count'
                }
            },


            credits: {
                enabled: false
            },
            loading: false,
            size: {}
        }

        $scope.reflow = function() {
            $scope.$broadcast('highchartsng.reflow');
        };
        /*chartconfig 3 - site utlization ends*/

        /*chartconfig 7 - Cost of ownership starts*/

        $scope.chartSeries = [{
            name: 'Device Count',
            data: [
                ['Battery Tray', 18],
                ['Transformer', 13],
                ['Switchgear', 11],
                ['Inverter', 16],
                ['ESPC', 28]
            ]
        }];


        $scope.chartConfig7 = {
            options: {
                chart: {
                    type: 'pie',
                    options3d: {
                        enabled: true,
                        alpha: 5
                    }
                },

                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.percentage:.1f} %'
                        },
                        innerSize: 65,
                        depth: 15,
                        showInLegend: true,
                    }
                },
            },
            series: $scope.chartSeries,
            title: {
                text: 'Number of Installation per Device Type',
                style: {
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    fontFamily: 'GE Inspira Sans, sans-serif'
                }
            },
            subtitle: {
                text: 'Total Device over year-to-date'
            },
            credits: {
                enabled: false
            },
            loading: false,
            size: {}
        }

        $scope.reflow = function() {
            $scope.$broadcast('highchartsng.reflow');
        };
        /*chartconfig 7 - Cost of ownership ends*/

        /*chartconfig 9 - Avg Installation time per site*/

        $scope.chartSeries = [{
            name: 'Site',
            colorByPoint: true,
            data: [{
                name: '0993605',
                y: 413200
            }, {
                name: '4567891',
                y: 513200
            }, {
                name: '9657842',
                y: 613200
            }, {
                name: '0236547',
                y: 713200
            }, {
                name: '9876324',
                y: 813200
            }, {
                name: '5463314',
                y: 913200
            }, {
                name: '7424663',
                y: 953200
            }],

            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                formatter: function() {
                    var time = this.y;
                    var hours1 = parseInt(time / 3600000);
                    var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                    return hours1 + 'h :' + mins1 + 'm';

                },
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '10px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }


        }];

        $scope.chartConfig9 = {
            options: {
                chart: {
                    type: 'column'
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },

                tooltip: {
                    formatter: function() {
                        var time = this.y;
                        var hours1 = parseInt(time / 3600000);
                        var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                        return this.key + '<br>Installation Time - <b>' + hours1 + 'h :' + mins1 + 'm</b>';

                    }

                },
            },
            series: $scope.chartSeries,


            title: {
                text: 'Average Installation Time per Device across site',
                style: {
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    fontFamily: 'GE Inspira Sans, sans-serif'
                }
            },
            xAxis: {
                title: {
                    text: 'Site'
                },
                type: 'category',
            },
            yAxis: {
                title: {
                    text: 'Time (hh:mm)'
                },
                labels: {
                    formatter: function() {
                        var time = this.value;
                        var hours1 = parseInt(time / 3600000);
                        var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                        return hours1 + ':' + mins1;
                    }
                }
            },

            credits: {
                enabled: false
            },
            loading: false,
            size: {}
        }

        $scope.reflow = function() {
            $scope.$broadcast('highchartsng.reflow');
        };
        /*chartconfig 9 - Avg Installation time per site ends*/


        /*chartconfig 11 - Avg Installation time per Device starts*/

        $scope.chartSeries = [{

            colorByPoint: true,
            data: [{
                name: '502342435',
                y: 553200,
                drilldown: 'Battery Tray'
            }, {
                name: '502627292',
                y: 653200,
                drilldown: 'Switchgear'
            }, {
                name: '320003386',
                y: 753200,
                drilldown: 'Inverter'
            }, {
                name: '212328493',
                y: 853200,
                drilldown: 'Transformer'
            }, {
                name: '320002318',
                y: 953200,
                drilldown: 'ESPC'
            }]
        }];

        $scope.chartConfig11 = {
            options: {
                chart: {
                    type: 'column'
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            formatter: function() {
                                var time = this.y;
                                var hours1 = parseInt(time / 3600000);
                                var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                                return hours1 + 'h :' + mins1 + 'm';

                            }
                        }
                    }
                },

                tooltip: {
                    formatter: function() {
                        var time = this.y;
                        var hours1 = parseInt(time / 3600000);
                        var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                        return this.key + '<br>Installation Time - <b>' + hours1 + 'h :' + mins1 + 'm</b>';

                    }

                },
            },
            series: $scope.chartSeries,
            drilldown: {
                series: [{
                    name: 'Battery Tray',
                    id: 'Battery Tray',
                    data: [
                        [
                            '0993605',
                            16320000
                        ],
                        [
                            '0123456',
                            26320000
                        ],
                        [
                            '7894561',
                            36320000
                        ],
                        [
                            '3216548',
                            46320000
                        ],
                        [
                            '4563217',
                            56320000
                        ],
                        [
                            '8962453',
                            66320000
                        ]
                    ]
                }, {
                    name: 'Switchgear',
                    id: 'Switchgear',
                    data: [
                        [
                            '0993605',
                            16320000
                        ],
                        [
                            '0123456',
                            26320000
                        ],
                        [
                            '7894561',
                            36320000
                        ],
                        [
                            '3216548',
                            46320000
                        ],
                        [
                            '4563217',
                            56320000
                        ],
                        [
                            '8962453',
                            66320000
                        ]
                    ]
                }, {
                    name: 'Inverter',
                    id: 'Inverter',
                    data: [
                        [
                            '0993605',
                            16320000
                        ],
                        [
                            '0123456',
                            26320000
                        ],
                        [
                            '7894561',
                            36320000
                        ],
                        [
                            '3216548',
                            46320000
                        ],
                        [
                            '4563217',
                            56320000
                        ],
                        [
                            '8962453',
                            66320000
                        ]
                    ]
                }, {
                    name: 'Transformer',
                    id: 'Transformer',
                    data: [
                        [
                            '0993605',
                            16320000
                        ],
                        [
                            '0123456',
                            26320000
                        ],
                        [
                            '7894561',
                            36320000
                        ],
                        [
                            '3216548',
                            46320000
                        ],
                        [
                            '4563217',
                            56320000
                        ],
                        [
                            '8962453',
                            66320000
                        ]
                    ]
                }, {
                    name: 'ESPC',
                    id: 'ESPC',
                    data: [
                        [
                            '0993605',
                            16320000
                        ],
                        [
                            '0123456',
                            26320000
                        ],
                        [
                            '7894561',
                            36320000
                        ],
                        [
                            '3216548',
                            46320000
                        ],
                        [
                            '4563217',
                            56320000
                        ],
                        [
                            '8962453',
                            66320000
                        ]
                    ]
                }]
            },

            title: {
                text: 'Average Installation Time per User across site',
                style: {
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    fontFamily: 'GE Inspira Sans, sans-serif'
                }
            },
            xAxis: {
                title: {
                    text: 'Device Type'
                },
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Time (hh:mm)'
                },
                labels: {
                    formatter: function() {
                        var time = this.value;
                        var hours1 = parseInt(time / 3600000);
                        var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                        return hours1 + ':' + mins1;
                    }
                }
            },

            credits: {
                enabled: false
            },
            loading: false,
            size: {}
        }

        $scope.reflow = function() {
            $scope.$broadcast('highchartsng.reflow');
        };
        /*chartconfig 11 - Avg Installation time per site ends*/




        /*chartconfig 11 - Avg Installation time per Device starts*/

        $scope.chartSeries = [{

            colorByPoint: true,
            data: [{
                name: '502342435',
                y: 553200,
                drilldown: 'Battery Tray'
            }, {
                name: '502627292',
                y: 653200,
                drilldown: 'Switchgear'
            }, {
                name: '320003386',
                y: 753200,
                drilldown: 'Inverter'
            }, {
                name: '212328493',
                y: 853200,
                drilldown: 'Transformer'
            }, {
                name: '320002318',
                y: 953200,
                drilldown: 'ESPC'
            }]
        }];

        $scope.chartConfig17 = {
            options: {
                chart: {
                    type: 'column'
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            formatter: function() {
                                var time = this.y;
                                var hours1 = parseInt(time / 3600000);
                                var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                                return hours1 + 'h :' + mins1 + 'm';

                            }
                        }
                    }
                },

                tooltip: {
                    formatter: function() {
                        var time = this.y;
                        var hours1 = parseInt(time / 3600000);
                        var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                        return this.key + '<br>Installation Time - <b>' + hours1 + 'h :' + mins1 + 'm</b>';

                    }

                },
            },
            series: $scope.chartSeries,
            drilldown: {
                series: [{
                    name: 'Battery Tray',
                    id: 'Battery Tray',
                    data: [
                        [
                            '0993605',
                            16320000
                        ],
                        [
                            '0123456',
                            26320000
                        ],
                        [
                            '7894561',
                            36320000
                        ],
                        [
                            '3216548',
                            46320000
                        ],
                        [
                            '4563217',
                            56320000
                        ],
                        [
                            '8962453',
                            66320000
                        ]
                    ]
                }, {
                    name: 'Switchgear',
                    id: 'Switchgear',
                    data: [
                        [
                            '0993605',
                            16320000
                        ],
                        [
                            '0123456',
                            26320000
                        ],
                        [
                            '7894561',
                            36320000
                        ],
                        [
                            '3216548',
                            46320000
                        ],
                        [
                            '4563217',
                            56320000
                        ],
                        [
                            '8962453',
                            66320000
                        ]
                    ]
                }, {
                    name: 'Inverter',
                    id: 'Inverter',
                    data: [
                        [
                            '0993605',
                            16320000
                        ],
                        [
                            '0123456',
                            26320000
                        ],
                        [
                            '7894561',
                            36320000
                        ],
                        [
                            '3216548',
                            46320000
                        ],
                        [
                            '4563217',
                            56320000
                        ],
                        [
                            '8962453',
                            66320000
                        ]
                    ]
                }, {
                    name: 'Transformer',
                    id: 'Transformer',
                    data: [
                        [
                            '0993605',
                            16320000
                        ],
                        [
                            '0123456',
                            26320000
                        ],
                        [
                            '7894561',
                            36320000
                        ],
                        [
                            '3216548',
                            46320000
                        ],
                        [
                            '4563217',
                            56320000
                        ],
                        [
                            '8962453',
                            66320000
                        ]
                    ]
                }, {
                    name: 'ESPC',
                    id: 'ESPC',
                    data: [
                        [
                            '0993605',
                            16320000
                        ],
                        [
                            '0123456',
                            26320000
                        ],
                        [
                            '7894561',
                            36320000
                        ],
                        [
                            '3216548',
                            46320000
                        ],
                        [
                            '4563217',
                            56320000
                        ],
                        [
                            '8962453',
                            66320000
                        ]
                    ]
                }]
            },

            title: {
                text: 'Average Installation Time per User',
                style: {
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    fontFamily: 'GE Inspira Sans, sans-serif'
                }
            },
            xAxis: {
                title: {
                    text: 'Device Type'
                },
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Time (hh:mm)'
                },
                labels: {
                    formatter: function() {
                        var time = this.value;
                        var hours1 = parseInt(time / 3600000);
                        var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                        return hours1 + ':' + mins1;
                    }
                }
            },

            credits: {
                enabled: false
            },
            loading: false,
            size: {}
        }

        $scope.reflow = function() {
            $scope.$broadcast('highchartsng.reflow');
        };
        /*chartconfig 11 - Avg Installation time per site ends*/




        /*chartconfig 10 - Avg Installation time per unit in site starts*/

        $scope.chartSeries = [{
            colorByPoint: true,
            data: [{
                name: 'Battery Tray',
                color: '#f15c80',
                y: 5632000,
                drilldown: 'Battery Tray'
            }, {
                name: 'Switchgear',
                color: '#e4d354',
                y: 6632000,
                drilldown: 'Switchgear'
            }, {
                name: 'Inverter',
                color: '#2b908f',
                y: 7632000,
                drilldown: 'Inverter'
            }, {
                name: 'Transformer',
                color: '#91e8e1',
                y: 8632000,
                drilldown: 'Transformer'
            }, {
                name: 'ESPC',
                color: '#f7a35c',
                y: 9632000,
                drilldown: 'ESPC'
            }]
        }];

        $scope.chartConfig10 = {
            options: {
                chart: {
                    type: 'column'
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            color: '#46ad00',
                            formatter: function() {
                                var time = this.y;
                                var hours1 = parseInt(time / 3600000);
                                var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                                return hours1 + 'h :' + mins1 + 'm';

                            }
                        }
                    }
                },

                tooltip: {
                    formatter: function() {
                        var time = this.y;
                        var hours1 = parseInt(time / 3600000);
                        var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                        return this.key + '<br>Installation Time - <b>' + hours1 + 'h :' + mins1 + 'm</b>';

                    }

                },
            },
            series: $scope.chartSeries,
            drilldown: {
                series: [{
                    name: 'Battery Tray',
                    id: 'Battery Tray',
                    data: [
                        [
                            '0993605',
                            16320000
                        ],
                        [
                            '0123456',
                            26320000
                        ],
                        [
                            '7894561',
                            36320000
                        ],
                        [
                            '3216548',
                            46320000
                        ],
                        [
                            '4563217',
                            56320000
                        ],
                        [
                            '8962453',
                            66320000
                        ]
                    ]
                }, {
                    name: 'Switchgear',
                    id: 'Switchgear',
                    data: [
                        [
                            '0993605',
                            16320000
                        ],
                        [
                            '0123456',
                            26320000
                        ],
                        [
                            '7894561',
                            36320000
                        ],
                        [
                            '3216548',
                            46320000
                        ],
                        [
                            '4563217',
                            56320000
                        ],
                        [
                            '8962453',
                            66320000
                        ]
                    ]
                }, {
                    name: 'Inverter',
                    id: 'Inverter',
                    data: [
                        [
                            '0993605',
                            16320000
                        ],
                        [
                            '0123456',
                            26320000
                        ],
                        [
                            '7894561',
                            36320000
                        ],
                        [
                            '3216548',
                            46320000
                        ],
                        [
                            '4563217',
                            56320000
                        ],
                        [
                            '8962453',
                            66320000
                        ]
                    ]
                }, {
                    name: 'Transformer',
                    id: 'Transformer',
                    data: [
                        [
                            '0993605',
                            16320000
                        ],
                        [
                            '0123456',
                            26320000
                        ],
                        [
                            '7894561',
                            36320000
                        ],
                        [
                            '3216548',
                            46320000
                        ],
                        [
                            '4563217',
                            56320000
                        ],
                        [
                            '8962453',
                            66320000
                        ]
                    ]
                }, {
                    name: 'ESPC',
                    id: 'ESPC',
                    data: [
                        [
                            '0993605',
                            16320000
                        ],
                        [
                            '0123456',
                            26320000
                        ],
                        [
                            '7894561',
                            36320000
                        ],
                        [
                            '3216548',
                            46320000
                        ],
                        [
                            '4563217',
                            56320000
                        ],
                        [
                            '8962453',
                            66320000
                        ]
                    ]
                }]
            },

            title: {
                text: 'Average Installation Time per Device in this site'
            },
            xAxis: {
                title: {
                    text: 'Device Type'
                },
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Time (hh:mm)'
                },
                labels: {
                    formatter: function() {
                        var time = this.value;
                        var hours1 = parseInt(time / 3600000);
                        var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                        return hours1 + ':' + mins1;
                    }
                }
            },

            credits: {
                enabled: false
            },
            loading: false,
            size: {}
        }

        $scope.reflow = function() {
            $scope.$broadcast('highchartsng.reflow');
        };
        /*chartconfig 10 - Avg Installation time per unit in site starts*/



        /*chartconfig 12 - Avg Installation time per unit*/

        $scope.chartSeries = [{
            data: [
                { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
                { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
                { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
                { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
                { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
                { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
                { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
                { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
                { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
                { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
                { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
                { x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States' },
                { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
                { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
                { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' }
            ]
        }];

        $scope.chartConfig12 = {
            options: {
                chart: {
                    type: 'bubble',
                    plotBorderWidth: 1,
                    zoomType: 'xy'
                },
                legend: {
                    enabled: false
                },

            },
            series: $scope.chartSeries,

            title: {
                text: 'Average Installation Time per Unit'
            },
            xAxis: {
                gridLineWidth: 1,
                title: {
                    text: 'Daily fat intake'
                },
                labels: {
                    format: '{value} gr'
                },
                plotLines: [{
                    color: 'black',
                    dashStyle: 'dot',
                    width: 2,
                    value: 65,
                    label: {
                        rotation: 0,
                        y: 15,
                        style: {
                            fontStyle: 'italic'
                        },
                        text: 'Safe fat intake 65g/day'
                    },
                    zIndex: 3
                }]
            },

            yAxis: {
                startOnTick: false,
                endOnTick: false,
                title: {
                    text: 'Daily sugar intake'
                },
                labels: {
                    format: '{value} gr'
                },
                maxPadding: 0.2,
                plotLines: [{
                    color: 'black',
                    dashStyle: 'dot',
                    width: 2,
                    value: 50,
                    label: {
                        align: 'right',
                        style: {
                            fontStyle: 'italic'
                        },
                        text: 'Safe sugar intake 50g/day',
                        x: -10
                    },
                    zIndex: 3
                }]
            },
            tooltip: {
                useHTML: true,
                headerFormat: '<table>',
                pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                    '<tr><th>Fat intake:</th><td>{point.x}g</td></tr>' +
                    '<tr><th>Sugar intake:</th><td>{point.y}g</td></tr>' +
                    '<tr><th>Obesity (adults):</th><td>{point.z}%</td></tr>',
                footerFormat: '</table>',
                followPointer: true
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }
            },

            credits: {
                enabled: false
            },
            loading: false,
            size: {}
        }

        $scope.reflow = function() {
            $scope.$broadcast('highchartsng.reflow');
        };
        /*chartconfig 12 - Avg Installation time per unit ends*/

        /*chartconfig 15 - Customer overview*/
        $scope.chartSeries = [{
            "name": "Site count",
            data: [
                ['Walmart', 32],
                ['IID', 25],
                ['Walmart3', 10],
                ['Walmart4', 29],
                ['Walmart5', 44]
            ]
        }];

        /*chartconfig 15 - Customer overview*/
        $scope.summaryCall = function() {
            $scope.overview = true;
            $scope.summary = false;

        };
        $scope.chartConfig15 = {
            options: {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
            },
            series: $scope.chartSeries,
            title: {
                text: 'Customer Overview'
            },
            xAxis: {
                title: {
                    text: 'Customer'
                },
                categories: ['Walmart', 'Amazon', 'ebay', 'Paypal', 'Yahoo', 'Tata', 'GE Current']
            },
            yAxis: {
                title: {
                    text: 'Site Count'
                }
            },
            credits: {
                enabled: false
            },
            loading: false,
            size: {}
        }

        $scope.reflow = function() {
            $scope.$broadcast('highchartsng.reflow');
        };


        PredixAssetService.getAssetsByParentId('root').then(function(initialContext) {

            //pre-select the 1st asset
            initialContext.data[0].selectedAsset = true;
            $scope.initialContexts = initialContext;
            $scope.initialContextName = initialContext.data[0].name;

            //load view selector
            $scope.openContext($scope.initialContexts.data[0]);
        }, function(message) {
            $log.error(message);
        });

        $scope.decks = [];
        $scope.selectedDeckUrl = null;

        // callback for when the Open button is clicked
        $scope.openContext = function(contextDetails) {

            // need to clean up the context details so it doesn't have the infinite parent/children cycle,
            // which causes problems later (can't interpolate: {{context}} TypeError: Converting circular structure to JSON)
            var newContext = angular.copy(contextDetails);
            newContext.children = [];
            newContext.parent = [];

            // url end point can change from context to context
            // so the same card can display different data from different contexts

            var url = {
                'parent': {
                    'datagrid-data': '/sample-data/datagrid-data.json'
                },
                'child': {
                    'core-vibe-rear-cruise': '/sample-data/core-vibe-rear-cruise.json',
                    'delta-egt-cruise': '/sample-data/delta-egt-cruise.json'
                },
                'child2': {
                    'core-vibe-rear-cruise': '/sample-data/core-vibe-rear-cruise0.json',
                    'delta-egt-cruise': '/sample-data/delta-egt-cruise.json'
                },
                'child3': {
                    'core-vibe-rear-cruise': '/sample-data/core-vibe-rear-cruise1.json',
                    'delta-egt-cruise': '/sample-data/delta-egt-cruise.json'
                }
            };

            newContext.urls = url[newContext.id];

            $scope.context = newContext;

            //Tag string can be classification from contextDetails
            PredixViewService.getDecksByTags(newContext.classification) // gets all decks for this context
                .then(function(decks) {
                    $scope.decks = [];

                    if (decks && decks.length > 0) {
                        decks.forEach(function(deck) {
                            $scope.decks.push({ name: deck.title, id: deck.id });
                        });
                    }
                });
        };

        $scope.viewServiceBaseUrl = PredixViewService.baseUrl;

        $scope.getChildren = function(parent, options) {
            return PredixAssetService.getAssetsByParentId(parent.id, options);
        };

        $scope.handlers = {
            itemOpenHandler: $scope.openContext,
            getChildren: $scope.getChildren
                // (optional) click handler: itemClickHandler: $scope.clickHandler
        };
    }]);
});