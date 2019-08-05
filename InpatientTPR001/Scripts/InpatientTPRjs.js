


let Inpatient_data = {
    name: '姓名',
    sex: '性別',
    birth: '生日民國年月日',
    date: '',
    time: '',
    begDate: '',
    endDate: '',
    show_chart: false,
    chartSettings: {
        area: 'true'
    },
    chartData: {
        columns: ['Time', 'Breath', 'DBP', 'Pulse', 'SBP', 'SPO2', 'Temperature', 'Weight'],
        rows: []
    },
    saveTPR: {
        PatNO: '',
        MonitorDate: '',
        MonitorTime: '',
        Temperature: '',
        Weight: '',
        Pulse: '',
        Breath: '',
        DBP: '',
        SBP: '',
        SPO2: ''
    }
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                    //月份 
        "d+": this.getDate(),                         //日 
        "h+": this.getHours(),                        //小时 
        "m+": this.getMinutes(),                      //分 
        "s+": this.getSeconds(),                      //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3),  //季度 
        "S": this.getMilliseconds()                   //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
}


let Inpatient = new Vue({
    el: '#biggest_box',
    data: Inpatient_data,

    methods: {
        get_inf() {
            if (this.saveTPR.PatNO != null) {
                this.date = new Date().format("yyyy-MM-dd")
                this.time = new Date().format("hh:mm")
                this.saveTPR.MonitorDate = new Date().format("yyyyMMdd")
                this.saveTPR.MonitorTime = new Date().format("hhmm")


                var thisDay = new Date
                this.endDate = thisDay.format("yyyyMMdd")
                this.begDate = thisDay.addDays(-7).format("yyyyMMdd")

                axios
                    .post('WebService/InpatientTPRWS.asmx/GetPatientData', { patNo: this.saveTPR.PatNO })
                    .then((res) => {
                        this.name = res.data.d.PatName
                        this.sex = res.data.d.Sex
                        this.birth = res.data.d.Birthday
                    }).catch((err) => {
                        console.log(err)
                    })
                axios
                    .post('WebService/InpatientTPRWS.asmx/GetTPRs', { patNO: this.saveTPR.PatNO, begDate: this.begDate, endDate: this.endDate })
                    .then((res) => {

                        this.chartData.rows = res.data.d
                        this.show_chart = true

                    }).catch((err) => {
                        console.log(err)
                    })
            }
        },

        save_TPR() {
            axios
                .post('WebService/InpatientTPRWS.asmx/SaveTPR', { thisTPR: this.saveTPR })
                .then((res) => {
                    if (res.status == 200) {
                        alert('存檔大成功!!')
                    }
                    else {
                        alert('存檔大失敗')
                    }
                    console.log(res)
                }).catch((err) => {

                })
        }
    }
});





