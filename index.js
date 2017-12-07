/**
 * Created by MSI on 29-Nov-17.
 */
var lat,lng;
var DistrictList = [];
var LatList = [];
var LngList = [];


function getLatLng(n,e,callback){
    $.getJSON("http://www.geodetic.gov.hk/transform/v2/?inSys=hkgrid&n="+n+"&e="+e)
        .then(function(data){
            lat = data.wgsLat;
            lng = data.wgsLong;
            callback([lat,lng]);
            return [lat, lng];
    });

}

function readfile(filepath){
    $.ajax({
        type: "GET",
        url: filepath,
        dataType: 'text',
    }).done(function(data){
        loadF(data, function(wholeList){
            writeFile(wholeList);
        });
    });
}

//this function will get the data: DistrictList, LatList and LngList
function loadF(data,callback){
    var allRows = data.split('\n');
    allRows[0];
    for (var rowIndex = 1; rowIndex<allRows.length; rowIndex++){
        if (allRows[rowIndex]=="")  break;
        var allCells = allRows[rowIndex].split("\t");
        if (allCells[1]=="") break;
        if (allCells[1]=="ENGLISH NAME") continue;
        var districtName = convertCharacterCase(allCells[6]);
        if (districtName=="" || districtName=="District" || districtName=="Country Park"){
            continue;
        }else if(districtName=="North"){
            districtName = "North Point";
        }
        DistrictList.push(districtName);
        var northing = allCells[5];
        var easting = allCells[4];
        //need wait for callback so any thing wants to do should put it in here
        getLatLng(northing, easting,function(LatLng){
            LatList.push(LatLng[0]);
            LngList.push(LatLng[1]);
            console.log(DistrictList[LatList.length-1]+","+LatList[LatList.length-1]+","+LngList[LngList.length-1]);
        });
    }
    callback([DistrictList,LatList,LngList]);
}

function writeFile(wholeList){
    var dList = wholeList[0];
    var LtList = wholeList[1];
    var LgList = wholeList[2];
    var rows = "District,Lat,Long\n";
    for (var i=0;i<dList.length;i++){
        rows+= (dList[i]+","+LtList[i]+","+LgList[i]+"\n");
    }
    //console.log(rows);
    // downloadCSV(rows);
}

//convert the character case to appropriate one 'Kowloon'
function convertCharacterCase(name){
    var words = name.split(" ");
    for (var i = 0; i<words.length; i++){
        var temp=words[i].charAt(0)+words[i].slice(1).toLowerCase();
        words[i]=temp;
    }
    var result = words[0];
    for (var i = 1; i<words.length; i++){
        temp = result+" "+words[i];
        result = temp;
    }
    return result;
}

// function downloadCSV(args) {
//     var data, filename, link;
//     var csv = convertArrayOfObjectsToCSV({
//         data: stockData
//     });
//     if (csv == null) return;
//
//     filename = args.filename || 'export.csv';
//
//     if (!csv.match(/^data:text\/csv/i)) {
//         csv = 'data:text/csv;charset=utf-8,' + csv;
//     }
//     data = encodeURI(csv);
//
//     link = document.createElement('a');
//     link.setAttribute('href', data);
//     link.setAttribute('download', filename);
//     link.click();
// }

