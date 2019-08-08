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

let Inpatient_data = {
    name: '姓名',
    sex: '性別',
    birth: '生日民國年月日',
    date: '',
    time: '',
    begDate: '',
    endDate: '',
    show_chart: false,
    chartData: {
        columns: ['Time', 'Breath', 'DBP', 'Pulse', 'SBP', 'SPO2', 'Temperature', 'Weight'],
        rows: []
    },
    chartEvents: {
        click(e) {
            console.log(e)
        },
    },
    dataZoom: {
        type: 'slider',
        start: 0,
        end: 20
    },
    loading: true,
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
    },

}

let Inpatient = new Vue({
    el: '#biggest_box',
    data: Inpatient_data,
    methods: {
        get_inf() {
            if (this.saveTPR.PatNO == "") {
                alert('誰人?')
            } else {
                if (this.date == "") {
                    const use_date = new Date
                    this.date = use_date.format("yyyy-MM-dd")
                    this.time = use_date.format("hh:mm")

                    this.saveTPR.MonitorDate = use_date.format("yyyyMMdd")
                    this.saveTPR.MonitorTime = use_date.format("hhmm")

                    this.endDate = use_date.format("yyyyMMdd")
                    this.begDate = use_date.addDays(-7).format("yyyyMMdd")
                }

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
                        this.loading = false

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
        },

    },

    watch: {
        date(oldval, val) {

            this.saveTPR.MonitorDate = oldval.substr(0, 3) + oldval.substr(5, 2) + oldval.substr(8, 2)
            console.log(oldval, val, this.saveTPR.MonitorDate)
        },
        time(oldval, val) {
            this.saveTPR.MonitorTime = oldval.substr(0, 2) + oldval.substr(3, 2)
            console.log(oldval, val, this.saveTPR.MonitorTime)
        }

    },
});





