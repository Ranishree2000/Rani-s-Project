sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/format/DateFormat',
    'sap/ui/core/library',
    'sap/ui/unified/DateRange',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,DateFormat,coreLibrary,DateRange,Filter,FilterOperator) {
        "use strict";
        var CalendarType = coreLibrary.CalendarType;

        return Controller.extend("application.controller.EmpPage", {
          oEmpToDoListFragment:null,
          oFormatYyyymmdd: null,
          fromDate:null,
          toDate:null,
          to:null,
          from:null,
          notificationArray:[],
          SelectedLeaveType:null,
          image:null,
          Profilearr:[],
          EmpLeaveInfo:null,
          UserLoginPopUp:null,
         
            onInit: function () {
              // this.oFormatYyyymmdd = DateFormat.getInstance({pattern: "yyyy-MM-dd", calendarType: CalendarType.Gregorian});

            // var arr = this.getView().getModel("")
            debugger
            this.oModel = new sap.ui.model.json.JSONModel({selectedDates: []});
            this.getView().setModel(this.oModel);

            // this.oModel.oData.selectedDates[1].Date
            
            this.getOwnerComponent().getRouter().getRoute("RouteEmpPage").attachPatternMatched(this._onRoutMatched,this);
            },

            _onRoutMatched:function(oEvent){
                debugger
                var oData = oEvent.getParameter("arguments").id1
                var oModel = this.getView().getModel("allEmpRecords").oData.data;
                oModel.forEach((val)=>{
                  if(val.EmpId == oData){
                    this.getView().byId("idEmpNameText").setText(val.EmpName);
                    this.getView().byId("idEmpIdText").setText(val.EmpId);
                  }
                })
            },
            onAfterRendering:function(){
              debugger
              var empId=localStorage.getItem("EMPID");
              var oModel= this.getOwnerComponent().getModel('allEmpRecords').oData.data;
              
              var idId = this.getView().byId("udetails");
              for (var i=0; i<oModel.length; i++){
                var oData= oModel[i].EmpId
                if(oData==empId){
                  idId.bindElement("allEmpRecords>/data/"+i+"/")
                }
           }

          },
            StatusFormatter:function(oValue){
              if(oValue == 'Approved')
              {
                return 'Success'
              }
              if(oValue == 'Rejected'){
                return 'Error'
              }
            },
            
            oEmpNotifDelet:function(oEvent){
              debugger
              var ItemToDelete = oEvent.mParameters.listItem.sId[oEvent.mParameters.listItem.sId.length-1]

              var arr = []
              var TempEmpNotificationModel = this.getView().getModel("empTempNotify")
              arr =  TempEmpNotificationModel.oData.data 


              var NotiId = arr[ItemToDelete].NotifyId

              //for deleting the notification
              var allEmpNotification = []
              var allEmpNotificationModel = this.getView().getModel("allEmpNotification")
              allEmpNotification = allEmpNotificationModel.oData.data

              allEmpNotification.forEach((ele,ind)=>{
                if(NotiId == ele.NotifyId){
                  allEmpNotification.splice(ind,1)
                }
              })
              allEmpNotificationModel.refresh(true)


              arr.splice(ItemToDelete,1)
              TempEmpNotificationModel.refresh(true)

            },
            SetDateValidation:function()
            {
              
              var CurrentWeek = {
                0:"Sun",
                1:"Mon",
                2:"Tue",
                3:"Wed",
                4:"Thu",
                5:"Fri",
                6:"Sat"
              }

              var CurrentMonths = {
                0:"Jan",
                1:"Feb",
                2:"Mar",
                3:"Apr",
                4:"May",
                5:"Jun",
                6:"Jul",
                7:"Aug",
                8:"Sep",
                9:"Oct",
                10:"Nov",
                11:"Dec",
                
              }
              // 'Wed Sep 14 2022'
              var SelectedDate = this.oModel.oData.selectedDates[0].Date
              console.log(SelectedDate);
              var date = new Date()
              var week = date.getDay()
              var day = date.getDate()
              var month = date.getMonth()
              
              var year = date.getFullYear()

              var TodaytDate = CurrentWeek[week]+" "+CurrentMonths[month]+" "+day+" "+year
              
              if(SelectedDate < TodaytDate)
              {
                // alert("Please Select from Todays Date")
                sap.m.MessageToast.show("Date is set")
                this.from.close()
                // this.from.destroy(true)

                // alert("today is greater")

              }
            else{
                // alert("Date is set")
                sap.m.MessageToast.show("Date is set")
                this.from.close()
                // this.from.destroy(true)

              }


            // this.oModel.oData.selectedDates[1].Date
              

            },
            changeToSingleSelectionMode: function () {
              var oCalendar = this.getView().byId("selectionCalendar");
              this._clearModel();
              oCalendar.unselectAllDates();
              oCalendar.setSelectionMode(sap.me.CalendarSelectionMode.SINGLE);
          },
      
          changeToRangeSelectionMode: function () {
              var oCalendar = this.getView().byId("selectionCalendar");
              this._clearModel();
              oCalendar.unselectAllDates();
              oCalendar.setSelectionMode(fragments.from.CalendarSelectionMode.RANGE);
          },
      
          changeToMultiSelectionMode: function () {
              var oCalendar = this.getView().byId("selectionCalendar");
              this._clearModel();
              oCalendar.unselectAllDates();
              oCalendar.setSelectionMode(sap.me.CalendarSelectionMode.MULTIPLE);
          },
      
          onTapOnDate: function (oEvent) {
             
            sap.m.MessageToast.show("You tapped on " + oEvent.getParameters().date + " didSelect: " + oEvent.getParameters().didSelect);
              this._updateModel();
              
          },
      
          onChangeRange: function (oEvent) {
              debugger
              sap.m.MessageToast.show("You selected a range of dates starting on: " + oEvent.getParameters().fromDate + " to: " + oEvent.getParameters().toDate);
              this._updateModel();
              debugger
          },
      
          _updateModel: function () {
              var oCalendar = sap.ui.getCore().byId("selectionCalendar");
              var aSelectedDates = oCalendar.getSelectedDates();
              var strDate;
              var oData = {selectedDates: []};
              if (aSelectedDates.length > 0) {
                  for (var i = 0; i < aSelectedDates.length; i++) {
                      strDate = aSelectedDates[i];
                      oData.selectedDates.push({Date: strDate });
                     
                  }
                  this.oModel.setData(oData);
              } else {
                  this._clearModel();
              }
          },
      
          _clearModel: function () {
              this.oModel.setData({selectedDates: []});
          },
            oClick:function(oEvent)
            {
              debugger
              var title = oEvent.mParameters.listItem.mProperties.title

              this.SelectedLeaveType = title
              var userArr = []

              userArr = this.getView().getModel("allEmpRecords").oData.data

              var EmpId= localStorage.getItem("EMPID")

            
              if(title == "SICK LEAVE")
              {
                for(var i=0;i<=userArr.length-1;i++)
               {
                  if(EmpId == userArr[i].userId)
                  {
                    sap.ui.getCore().byId("leaveTypeText").setText("SICK LEAVE")
                    
                    sap.ui.getCore().byId("SickLeave").setText(userArr[i].SickLeave)

                  }
               }

              }
              else if(title == "CASUAL LEAVE")
              {
                for(var i=0;i<=userArr.length-1;i++)
               {
                  if(EmpId == userArr[i].userId)
                  {
                    sap.ui.getCore().byId("leaveTypeText").setText("CASUAL LEAVE")
                    
                    sap.ui.getCore().byId("SickLeave").setText(userArr[i].CasualLeave)

                  }
               }
              }
            },
            onEmpLogout:function(){
                let arr = []
                var oModel = this.getView().getModel("profilePic")

                arr = {

                    "img" : "https://tse1.mm.bing.net/th?id=OIP.8pQGc1uvCGFkeniunEv1rwHaHa&pid=Api&P=0"
                }

                oModel.setData(arr)
                this.getView().setModel(oModel)

                // clearing notification model for pirticular employee

                
              var TempEmpNotificationModel = this.getView().getModel("empTempNotify")
              TempEmpNotificationModel.oData.data = []
              TempEmpNotificationModel.refresh(true)

        

              this.getOwnerComponent().getRouter().navTo("Routehome",null,true)
            },

            ApplyLeave:function()
            {
              // alert("hii")

              this.AddLeavePopUp =new sap.ui.xmlfragment("application.fragments.AddLeavePopUp",this)
              this.getView().addDependent(this.AddLeavePopUp)

              // sap.ui.getCore().byId("SickLeave1").setText("hi")
              var updateEmpArray=new Array()
              var empId=localStorage.getItem("EMPID")
              var oModel=this.getView().getModel("allEmpRecords")
              updateEmpArray=oModel.oData.data
              for(var i=0;i<=updateEmpArray.length-1;i++)
              {
                if(empId==updateEmpArray[i].userId)
                {
                  
                  

                } 
              }


              this.AddLeavePopUp.open()
            },
            
            AddLeaveCloseButton:function()
            {
              this.AddLeavePopUp.close()
              this.AddLeavePopUp.destroy(true)
            },

            
            onEmpNotify:function(){
              // alert("hello")
             
              this.empNotification =new sap.ui.xmlfragment("application.fragments.empNotification",this)
              this.getView().addDependent(this.empNotification)
              debugger

              //Featcing all notification model data and sending to tempNotificaiton model
              
              var allEmpNotification = []
              var allEmpNotificationModel = this.getView().getModel("allEmpNotification")
              allEmpNotification = allEmpNotificationModel.oData.data


              var TempEmpNotification = []
              var TempEmpNotificationModel = this.getView().getModel("empTempNotify")
              TempEmpNotification = TempEmpNotificationModel.oData.data
              allEmpNotification.filter((ele, ind)=>{
                if(ele.Empid == localStorage.getItem("EMPID"))
                {
                  TempEmpNotification.push(ele)
                }
              })
              TempEmpNotificationModel.refresh(true)
              this.empNotification.open()
            },
            empNotifyCloseButton:function(){
              this.empNotification.destroy(true)
              this.empNotification = null

              var TempEmpNotificationModel = this.getView().getModel("empTempNotify")
              TempEmpNotificationModel.oData.data = []
              TempEmpNotificationModel.refresh(true)
            },


            onCloseFrom:function(){
              this.from.close()
              // this.from.destroy(true)
            },

            OnClickPressFrom:function(){
             
                this.from =new sap.ui.xmlfragment("application.fragments.from",this)
                this.getView().addDependent(this.from)

                this.from.open()
                  
              

            },

            handleCalendarSelect:function(oEvent){
              // debugger
              var oCalendar = oEvent.getSource();
              this.fromDate=oEvent.getSource();
			        this._updateText(oCalendar);

            },


            
            _updateText: function(oCalendar) {
              var oText = sap.ui.getCore().byId("selectedDate"),
                aSelectedDates = oCalendar.getSelectedDates(),
                oDate = aSelectedDates[0].getStartDate();
                this.fromDate=aSelectedDates

        
              oText.setText(this.oFormatYyyymmdd.format(oDate));
              this.fromDate=sap.ui.getCore().byId('selectedDate').getText()

            },
        
            handleSelectToday: function() {
              var oCalendar = sap.ui.getCore().byId("calendar");
        
              oCalendar.removeAllSelectedDates();
              oCalendar.addSelectedDate(new DateRange({startDate: new Date()}));
              this._updateText(oCalendar);
            },





            onCloseto:function(){
              this.to.close()
              // this.to.destroy(true)
              

            },
            OnClickPressto:function(){
            
              if(!this.to){
                this.to =new sap.ui.xmlfragment("application.fragments.to",this)
                this.getView().addDependent(this.to)
              }
              
              
              this.to.open()

            },

            
            handleCalendarSelect1:function(oEvent){
              // debugger
              var oCalendar = oEvent.getSource();
              this.toDate=oEvent.getSource();

			        this._updateText1(oCalendar);

            },
            _updateText1: function(oCalendar) {
              var oText = sap.ui.getCore().byId("selectedDate1"),
                aSelectedDates = oCalendar.getSelectedDates(),

                oDate = aSelectedDates[0].getStartDate();
                this.toDate=aSelectedDates

        
              oText.setText(this.oFormatYyyymmdd.format(oDate));
              this.toDate=sap.ui.getCore().byId('selectedDate1').getText()

            },
        
            handleSelectToday1: function() {
              var oCalendar = sap.ui.getCore().byId("calendar1");
        
              oCalendar.removeAllSelectedDates();
              oCalendar.addSelectedDate(new DateRange({startDate: new Date()}));
              this._updateText1(oCalendar);
            },

           

            onPressApplyLeaveButton:function(){

               debugger
               var dates = this.oModel.oData.selectedDates
               var Leavetype = sap.ui.getCore().byId("Leavetype").getValue()
               if(Leavetype == "")
               {
                 sap.ui.getCore().byId("Leavetype").setValueState("Error")
               }

              else if(dates.length==0)
              {
                alert("No Dates are Selected")
                sap.ui.getCore().byId("SelectDateButtonValidation").setType("Reject")

              }
              else{
                debugger
                var arr = []
                var count = this.oModel.oData.selectedDates
                var leaveType = sap.ui.getCore().byId("Leavetype").getValue()

                if(leaveType == "Sick Leave")
                {

                  let empArr = []
                  empArr = this.getView().getModel("allEmpRecords").oData.data
                  
                  let logEmpId = localStorage.getItem("EMPID")

                  let oModel = this.getView().getModel("notify")
                  arr = oModel.oData.data

                  for(var i=0;i<=empArr.length-1;i++)
                  {
                    if(empArr[i].userId == logEmpId)
                    {
                      if(this.oModel.oData.selectedDates.length > empArr[i].SickLeave)
                      {
                        alert("Insufficent Sick_Leave Days")
                      }
                      else{
                
                    arr.push({
                      "NoOfDays":count.length,
                      "EmpID":localStorage.getItem("EMPID"),
                      "Status":"Pending",
                      "leaveType":"Sick Leave",
                      "remarks":sap.ui.getCore().byId("leaveRemarks").getValue(),
              
                    })
                  sap.m.MessageToast.show("Leave has been applied")
                  
                }
              }
            }

                  oModel.setData({data:arr})
                  this.getView().setModel(oModel)
                }
                else if(leaveType == "Casual Leave")
                {

                  let empArr = []
                  empArr = this.getView().getModel("allEmpRecords").oData.data
                  
                  let logEmpId = localStorage.getItem("EMPID")

                  let oModel = this.getView().getModel("notify")
                  arr = oModel.oData.data

                  for(var i=0;i<=empArr.length-1;i++)
                  {
                    if(empArr[i].userId == logEmpId)
                    {
                      if(this.oModel.oData.selectedDates.length > empArr[i].CasualLeave)
                      {
                        alert("Insufficent Casual_Leave Days")
                      }
                      else{

                  arr.push({
                    "NoOfDays":count.length,
                    "EmpID":localStorage.getItem("EMPID"),
                    "Status":"Pending",
                    "leaveType":"Casual Leave",
                    "remarks":sap.ui.getCore().byId("leaveRemarks").getValue()
                  })
                sap.m.MessageToast.show("Leave has been applied")


                }
              }
            }

                  oModel.setData({data:arr})
                  this.getView().setModel(oModel)
                 
                }
                  this.AddLeavePopUp.close()
                  this.AddLeavePopUp.destroy(true)
              }
                          
             
            },
           


            onPressUserProfile:function(oEvent){
              debugger
              if(!this.UserLoginPopUp){
                this.UserLoginPopUp =new sap.ui.xmlfragment("application.fragments.UserLoginPopUp",this)
                this.getView().addDependent(this.UserLoginPopUp)
                this.UserLoginPopUp.open()
                var id= localStorage.getItem("EMPID")
                var oModel = this.getView().getModel("allEmpRecords").oData.data
                var simpleFormId = sap.ui.getCore().byId("idSimpleForm1")
                for (var i=0; i<oModel.length; i++){
                 var oData= oModel[i].EmpId
                 if(oData==id){
                 simpleFormId.bindElement("allEmpRecords>/data/"+i+"/")
                  
                  // debugger
                //   if(!this.UserLoginPopUp){
                //     debugger
                //     this.UserLoginPopUp =new sap.ui.xmlfragment("application.fragments.UserLoginPopUp",this)
                //     this.getView().addDependent(this.UserLoginPopUp)
                //     
                //     // formId.bindElement("allEmpRecords>/oData/data"+i)

                //     this.UserLoginPopUp.open()

                //  }
                // }
                
                // var simpleFormId = sap.ui.getCore().byId("idUserProfileSimpleForm")
                // simpleFormId.bindElement(oModel)
                // this.getOwnerComponent().getModel().read("/ZRS_LOGIN_TABSet",{
                //   method:"GET",
                //   success:function(data){
                //     debugger
                //   oModel.setData(data.results)

                //   },
                //   error(){

                //   }
                // })
                // this.getView().setModel(oModel);

                 }
              }
             
              }  
            },
            
            UserLoginCloseButton:function()
            {
              this.UserLoginPopUp.close()
              this.UserLoginPopUp.destroy(true);
              this.UserLoginPopUp = null;
              sap.ui.getCore().byId("GenericTilebackground").setBackgroundImage(" ")
            },


            ProfileImagePicked:function(oEvent)
            {
                
                var f = oEvent.oSource.oFileUpload.files[0]
                 this.image = URL.createObjectURL(f)
                 localStorage.setItem("newimg",this.image)
     
            },

           


            // uploadin image

            UploadProfileImage:function()//uploading image function
            {
              debugger
              this.getView().byId("profilePic")

                var oTile = sap.ui.getCore().byId("GenericTilebackground")
                
                var newImage=localStorage.getItem("newimg")
                oTile.setBackgroundImage(newImage)

                // this.getView().byId("ProfileImg").setSrc(newImage)

                var oModel = this.getView().getModel("profile")

                var arr = []
                  arr = oModel.getData().data
               
                arr.push({
                  "img":this.image,
                  "id":localStorage.getItem("EMPID")
                })


                oModel.setData(arr,"data")
                this.getView().setModel(oModel)
                 
             

            },


            // reset password validation

            onPressButton:function(){
             
              debugger
              var PhoneValue =/^[7-9][0-9]{9}$/

            var numm=  sap.ui.getCore().byId("e").getValue()
          //     if(numm.length!=10){
          //   sap.ui.getCore().byId("e").setValueState("Error")
          //   sap.ui.getCore().byId("e").setValueStateText("number should be equal to 10 digit")

          // }
          if(!(PhoneValue.test(numm)))
            {
                
                    sap.ui.getCore().byId("e").setValueState("Error")
                    sap.ui.getCore().byId('e').setValueStateText("Number Must begin 7/8/9 and 10 digit length")
            }
            if((sap.ui.getCore().byId("e").getValue()!='') && (sap.ui.getCore().byId("e").getValue().length==10))
            {
              sap.ui.getCore().byId("e").setValueState("None")


              var arr = []

              var oModel = this.getView().getModel("allEmpRecords")
              arr=oModel.oData.data
          
              for(var i=0;i<=arr.length-1;i++)
              {
                if(EmpId == arr[i].userId)
                {
                  arr[i].phone = sap.ui.getCore().byId("e").getValue()
        
                }
              }
              this.getView().getModel("allEmpRecords").refresh(true)

              sap.m.MessageToast.show("Data saved successfully")
            }
            if(!(sap.ui.getCore().byId("ProfilePickUploader").getValue()==''))
            {
              sap.ui.getCore().byId("c").setValueState("None")


              var arr = []

              var oModel = this.getView().getModel("allEmpRecords")
              arr=oModel.oData.data
              var EmpId = localStorage.getItem("EMPID")
              // var newImage=localStorage.getItem("newimg")


        
              for(var i=0;i<=arr.length-1;i++)
              {
                if(EmpId == arr[i].userId)
                {
  
                  arr[i].image =  this.image
                }
              }
              this.getView().getModel("allEmpRecords").refresh(true)
              // oModel.setData(arr)
              // this.getView().setModel(oModel)

              let arr1 = []
              var oModel1 = this.getView().getModel("profilePic")

              arr1 = {

                  "img" : this.image
              }

              oModel1.setData(arr1)
              this.getView().setModel(oModel1)
              sap.m.MessageToast.show("Data saved successfully")
              sap.ui.getCore().byId("ProfilePickUploader").setValue(null)
            }

             },



             
             oLeaveInfo:function(){
              
              debugger
              if(!this.EmpLeaveInfo)
              {
                this.EmpLeaveInfo =new sap.ui.xmlfragment("application.fragments.EmpLeaveInfo",this)
                this.getView().addDependent(this.EmpLeaveInfo)
              }

              var fArr = []
              fArr = this.getView().getModel("approvedLeaves").oData.data

             var fArray = fArr.filter((ele,ind)=>{

                return localStorage.getItem("EMPID") == ele.Empid;

              })

              this.getView().getModel("singleEmpNotify").setData({data:fArray})
              this.getView().getModel("singleEmpNotify").refresh(true)


              this.EmpLeaveInfo.open()
             },
             oEmpleaveInfoClose:function()
             {
              this.EmpLeaveInfo.destroy(true)
              this.EmpLeaveInfo = null
             },
             oEmpToDoList:function()
             {
              if(!this.oEmpToDoListFragment)
              {
                this.oEmpToDoListFragment =new sap.ui.xmlfragment("application.fragments.oEmpToDoList",this)
                this.getView().addDependent(this.oEmpToDoListFragment)
              }
              this.oEmpToDoListFragment.open()
             },
             oEmpToDolistClose:function()
             {
              this.oEmpToDoListFragment.destroy(true)
              this.oEmpToDoListFragment = null
             },

            //  onBeforeRendering:function(){
            //   debugger
            //     var empId=localStorage.getItem("EMPID");
            //     var oModel= this.getOwnerComponent().getModel('allEmpRecords').oData.data;
                
            //     var idId = this.getView().byId("udetails");
            //     for (var i=0; i<oModel.length; i++){
            //       var oData= oModel[i].EmpId
            //       if(oData==empId){
            //         idId.bindElement("allEmpRecords>/data/"+i+"/")
            //       }
            //  }
            // }
            
        });
    });