var ctx = document.getElementById('myChart').getContext('2d');
var config = {
    type: 'line',
    data: {
        labels: [ // Date Objects
            'data1',
            'data2',
            'data3',
            'data4',
            'data5',
        ],
        datasets: []
    },
    options: {
        maintainAspectRatio: false,
        title: {
            text: 'Chart.js Time Scale'
        },
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Throughput'
                },
                ticks: {
                    max: 200,
                    min: 0
                }
            }]
        },
        animaion: false
    }
};

console.log(ctx);

//차트 그리기
var myChart = new Chart(ctx, config);
var datas;

document.getElementById('start').onclick = function(){
    const target = document.getElementById('start');
    target.disabled = true;
    console.log("HEEEOO");
    setInterval(function () {
        // console.log("Send bitrate with id");
        fetch('https://192.168.93.50:50000/data')
            .then((res) => res.json())
            .then((data) => datas = data);

        console.log(datas);
        // 데이터셋이 이미 존재했는지 확인하고 추가
        var curData = datas.dataset;
        var dataset = config.data.datasets;

        var search = false;
        for (var i = 0; i < curData.length; i++) {
            for (var j = 0; j < dataset.length; j++) {
                if (dataset[j].label == curData[i].id) {
                    search = true;
                    var bitData = dataset[j].data;
                    for (var k = 0; k < 5; k++) {
                        if (curData[i].bitrate[k])
                            bitData[k] = curData[i].bitrate[k];
                        else
                            bitData[k] = 0;
                    }
                }
            }

            // 데이터셋을 찾지 못햇으면 새로운 id가 왔다는 의미로 업데이트
            if (!search) {
                var color1 = Math.floor(Math.random() * 256);
                var color2 = Math.floor(Math.random() * 256);
                var color3 = Math.floor(Math.random() * 256);

                console.log(color1 + " " + color2 + " " + color3)

                var newDataset = {
                    label: curData[i].id,
                    borderColor: 'rgba(' + color1 + ', ' + color2 + ', ' + color3 + ', 1)',
                    backgroundColor: 'rgba(' + color1 + ', ' + color2 + ', ' + color3 + ', 1)',
                    data: [],
                    fill: false,
                    datalabels: {
                        color: 'black',
                        align: 'top'
                    }
                }

                // newDataset에 데이터 삽입
                for (var j = 0; j < 5; j++) {
                    if (curData[i].bitrate[j])
                        newDataset.data.push(curData[i].bitrate[j]);
                    else
                        newDataset.data.push(0);
                }

                // chart에 newDataset 푸쉬
                config.data.datasets.push(newDataset);
            }
            search = false;
        }
        myChart.update();
    }, 1500);
}

// //데이터 추가
// document.getElementById('addData').onclick = function(){
    
// 	//라벨추가
// 	config.data.labels.push('data'+config.data.labels.length)
    
// 	//데이터셋 수 만큼 반복
// 	var dataset = config.data.datasets;
// 	for(var i=0; i<dataset.length; i++){
// 		//데이터셋의 데이터 추가
// 		dataset[i].data.push(Math.floor(Math.random() * 50));
// 	}
// 	myChart.update();	//차트 업데이트
// }

// //데이터셋 추가
// document.getElementById('addDataSet').onclick = function(){
// 	var color1 = Math.floor(Math.random() * 256);
// 	var color2 = Math.floor(Math.random() * 256);
// 	var color3 = Math.floor(Math.random() * 256);
    
// 	console.log(color1 + " " + color2 + " " + color3)
    
// 	var newDataset = {
// 		label: 'new Dataset'+config.data.datasets.length,
// 		borderColor : 'rgba('+color1+', '+color2+', '+color3+', 1)',
// 		backgroundColor : 'rgba('+color1+', '+color2+', '+color3+', 1)',
// 		data: [],
// 		fill: false
// 	}
    
// 	// newDataset에 데이터 삽입
// 	for (var i=0; i< config.data.labels.length; i++){
// 		var num = Math.floor(Math.random() * 50);
// 		newDataset.data.push(num);
// 	}
    
// 	// chart에 newDataset 푸쉬
// 	config.data.datasets.push(newDataset);
    
// 	myChart.update();	//차트 업데이트
// }

// //데이터 삭제
// document.getElementById('delData').onclick = function(){
    
// 	config.data.labels.splice(-1,1);//라벨 삭제
    
// 	//데이터 삭제
// 	config.data.datasets.forEach(function(dataset) {
// 		dataset.data.pop();
// 	});
    
// 	myChart.update();	//차트 업데이트
// }

// //데이터셋 삭제
// document.getElementById('delDataset').onclick = function(){
// 	config.data.datasets.splice(-1,1);
// 	myChart.update();	//차트 업데이트
// }