var app = angular.module("TapSmpOiGererator", [ "kendo.directives", "xlsx-model" ]);

app.controller("GridCtrl", function($scope, $rootScope){

	$scope.onClickRowCreateOi = function(event) {
		var fetchData = $scope.bindEventDataObj(this.dataItem($(event.currentTarget).closest("tr")));
		$scope.showDialog();
    };

    $scope.onClickRowPreview = function(event) {
    	var fetchData = $scope.bindEventDataObj(this.dataItem($(event.currentTarget).closest("tr")));
    	$scope.showDialog();
    };

    $scope.gridColumns = [
        {field: "index", title: "No.", width: "3%"},
    	{field: "oiType", title: "OI Type", width: "6%"},
    	{field: "toolID", title: "Tool ID", width: "7%"},
    	{field: "tapVers", title: "TAP Version", width: "8%"},
    	{field: "xpathOper", title: "XPath Operation"},
    	{command: { text: "Preview", click: $scope.onClickRowPreview }, title: "", width: "6%"},
    	{command: { text: "Create OI", click: $scope.onClickRowCreateOi }, title: "", width: "7%"},
    	{field: "isOK", title: "Finish", width: "4%"},
    ];

    $scope.gridData = new kendo.data.DataSource({
    	data: [
        	{ index: 1, oiType: "Smp", toolID: "A1", tapVers: "4.5", xpathOper: "//HELLO/@name=\"a.xml\"", isOK: false },
    	],
		pageSize: 12,
    });

    $scope.mainGridOptions = {
		dataSource: $scope.gridData,
		columns: $scope.gridColumns,
		pageable: {
	        pageSize: 12
		},
	};

    $rootScope.$on('EXCEL_FILE_LOADED', function(event, data){
    	$scope.clearAllDara();

    	var index = 0;
        angular.forEach(data, function(fileContent, keyFile) {
        	angular.forEach(fileContent, function(workTable, keyWorkTable){
        		angular.forEach(workTable, function(targetData, key){
        			$scope.addNewColumnData(index, targetData);
        			index = index + 1;
        		});
        	});
        });
    });

    $scope.addNewColumnData = function(indexNum, data) {
    	data.isOK = false;
    	data.index = indexNum;
    	$scope.gridData.add(data);
    };

    $scope.clearAllDara = function() {
    	var index = 0;
    	while(index < $scope.gridData.data().length) {
    		$scope.gridData.remove($scope.gridData.at(0));
    	}
    };

    $scope.bindEventDataObj = function(eventData) {
    	var newData = {};
    	angular.forEach($scope.gridColumns, function(data, key){
    		if(data.field != "" && data.field != null) {
    			newData[data.field] = eventData[data.field];
    		}
    	});
    	return newData;
    };

    $scope.showDialog = function() {
	    $( "#dialog-confirm" ).dialog({
	      dialogClass: 'no-close',
	      resizable: true,
	      modal: true,
	      title: "Are you all right?",
	      buttons: {
	        Cancel: function() {
	          $( this ).dialog( "close" );
	        }
	      },
	      width: 600,
	      height: 600
	    });
	    $( "#dialog-confirm" ).html("Here are some contents")
    };
});