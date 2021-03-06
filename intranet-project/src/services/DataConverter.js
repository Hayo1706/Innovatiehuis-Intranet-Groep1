export function jsonToJsDate(sqlDate){
    if (!sqlDate) throw new Error('Date is undefined');

    //sqlDate in SQL DATETIME format ("yyyy-mm-ddThh:mm:ss.msZ")
    var sqlDateArr1 = sqlDate.split("-");
    //format of sqlDateArr1[] = ['yyyy','mm','dd hh:mm:ms']
    var sYear = sqlDateArr1[0];
    var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
    var sqlDateArr2 = sqlDateArr1[2].split("T");
    //format of sqlDateArr2[] = ['dd', 'hh:mm:ss.ms']
    var sDay = sqlDateArr2[0];
    var sqlDateArr3 = sqlDateArr2[1].split(":");
    //format of sqlDateArr3[] = ['hh','mm','ss.ms']
    var sHour = sqlDateArr3[0];
    var sMinute = sqlDateArr3[1];
    var sqlDateArr4 = sqlDateArr3[2].split("Z");
    //format of sqlDateArr4[] = ['ss','ms']
    var sSecond = sqlDateArr4[0];
    var sMillisecond = '000';

    var date = new Date(sYear,sMonth,sDay,sHour,sMinute,sSecond,sMillisecond);

    return date;
}

export function getPathArguments(path) {
    var pathArray = path.split('/');
    var pathArgs = { path: path };
    var isNumericRegEx = /^\d+$/;
    
    pathArray.forEach((element, index) => { 
        if(isNumericRegEx.test(element)) { 
            pathArgs[pathArray[index - 1]] = element 
        }
    });

    return pathArgs;
}
