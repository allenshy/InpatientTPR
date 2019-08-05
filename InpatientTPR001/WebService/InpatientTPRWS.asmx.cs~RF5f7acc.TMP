using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Web.Services;

using WebERP;

namespace InpatientTPR001.WebService
{
    /// <summary>
    ///InpatientTPRWS 的摘要描述
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    
    [System.ComponentModel.ToolboxItem(false)]
    // 若要允許使用 ASP.NET AJAX 從指令碼呼叫此 Web 服務，請取消註解下列一行。
    [System.Web.Script.Services.ScriptService]
    public class InpatientTPRWS : System.Web.Services.WebService
    {
        public class PatientInfo
        {
            public string PatNO { get; set; } //病歷號
            public string PatID { get; set; } //身份證號
            public string PatName { get; set; } //病人姓名
            public string Sex { get; set; } //性別 M/F
            public string Birthday { get; set; }  //出生年月日  0800601 (民國年月日)
        }

        public class TPRData
        {
            public string PatNO { get; set; }
            public string MonitorDate { get; set; }
            public string MonitorTime { get; set; }
            public double Temperature { get; set; }
            public double Weight { get; set; }
            public double Pulse { get; set; }
            public double Breath { get; set; }
            public double DBP { get; set; }
            public double SBP { get; set; }
            public double SPO2 { get; set; }
            public string Time { get; set; }
        }
        /*1. GetPatientData
                input: patNo(string) //病歷號
                output: PatientInfo(class)*/
        [WebMethod]
        public PatientInfo GetPatientData(string patNo)
        {
            //資料庫連線字串
            TPECHDBService tpech = TPECHDBService.getInstance();
            DbConnection conn = tpech.GetTPECHConnection("B");
            conn.Open();
            //SQL SELECT指令與執行
            string sql = "select * from MEDRECM where PAT_NO =";


            DbCommand command = conn.CreateCommand();
            //command.Parameters.Add("", OracleType.VarChar, 3).Value = "a"; ;
            command.CommandText = sql + patNo;
            command.CommandType = CommandType.Text;

            try
            {
                //讀取資料
                DbDataReader reader = command.ExecuteReader();
                PatientInfo Patient = new PatientInfo();
                //將資料放進Patient物件
                while (reader.Read())
                {
                    Patient.PatNO = patNo;
                    Patient.PatID = reader.GetString(1);
                    Patient.PatName = reader.GetString(2);
                    Patient.Sex = reader.GetString(3);
                    Patient.Birthday = reader.GetString(4);
                }
                reader.Close();
                //回傳值(Patient物件)
                return Patient;
            }
            finally
            {
                conn.Close();
            }

        }

        /*2. SaveTPR
                input: tprData(TPRData class) //tprData is TPRData json string
                output: boolean //存檔成功 True? 失敗 False*/
        [WebMethod]
        public bool SaveTPR(TPRData thisTPR)
        {
            int rows;
            bool y = false;
            //資料庫連線字串
            TPECHDBService tpech = TPECHDBService.getInstance();
            DbConnection conn = tpech.GetTPECHConnection("B");
            conn.Open();
            
            try
            {
                //SQL INSERT 指令
                DbCommand command = conn.CreateCommand();
                command.CommandText = "INSERT INTO INPTPRM"+ 
                    "(PAT_NO, MONITOR_DATE, MONITOR_TIME, TEMPERATURE, WEIGHT, PULSE, BREATH, DBP, SBP, SPO2, OP_DATE)"+ 
                    "VALUES ('" + thisTPR.PatNO + "', '" + thisTPR.MonitorDate + "', '" + thisTPR.MonitorTime + "', " + thisTPR.Temperature + ", " + thisTPR.Weight + ", " + thisTPR.Pulse + ", " + thisTPR.Breath + ", " + thisTPR.DBP + ", " + thisTPR.SBP + ", " + thisTPR.SPO2 + ", sysdate)";
                rows = command.ExecuteNonQuery();
                //如果有異動的資料改變布林值
                if (rows > 0)
                    y = true;
            }
            finally
            {
                conn.Close();
            }
            //回傳是否有資料異動之布林值
            return y;
        }

        /*3. GetTPRs
              input: patNo(string)、begDate(string)、endDate(string)
              output: array of TPRData(class)*/
        [WebMethod]
        public List<TPRData> GetTPRs(string patNO, string begDate, string endDate)
        {
            //資料庫連線字串
            TPECHDBService tpech = TPECHDBService.getInstance();
            DbConnection conn = tpech.GetTPECHConnection("B");
            conn.Open();
            //SQL SELECT語法語讀取
            DbCommand command = conn.CreateCommand();
            command.CommandText = "select Monitor_Date||Monitor_Time as time,Temperature,Weight,Pulse,Breath,DBP,SBP,SPO2 from INPTPRM where PAT_NO ='" + patNO + "' AND MONITOR_DATE BETWEEN '" + begDate + "' and '" + endDate + "'";
            command.CommandType = CommandType.Text;
            DbDataReader reader = command.ExecuteReader();
            //使用動態陣列存取物件資料

            

            List<TPRData> TPRD = new List<TPRData>();
            
            while (reader.Read())
            {
                TPRD.Add(new TPRData()
                {
                    Time = reader.GetString(0),
                    Temperature = reader.GetDouble(1),
                    Weight = reader.GetDouble(2),
                    Pulse = reader.GetDouble(3),
                    Breath = reader.GetDouble(4),
                    DBP = reader.GetDouble(5),
                    SBP = reader.GetDouble(6),
                    SPO2 = reader.GetDouble(7),

                });
            }
            conn.Close();
            //回傳TPRD物件
            return TPRD;
        }
        
    }
}




