sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/Dialog",
  "sap/m/library",
  "sap/m/Button",
  "sap/m/Text",
  "sap/m/MessageToast",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  'sap/ui/core/format/DateFormat',
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller,Dialog,library,Button,Text,MessageToast,Filter,FilterOperator,DateFormat,UI5Date) {
      "use strict";
      var DialogType = library.DialogType;
      var ButtonType = library.ButtonType;
      var ItemToDelete = null;
      var oEditEmp = null;
      return Controller.extend("application.controller.HRPage", {
        oValue :null,
        AddEmpPopUp:null,
        viewEmp:null,
        ConfirmDelEmp:null,
   
        UserID:null,
        EmpDetailsView:null,
          onInit: function () {
            // this.UserID=100
            
          },
          onAfterRendering:function(){
           
            setInterval(()=>{
              var oModel = this.getView().getModel("time")
              
              var date = new Date();
              oModel.oData.time = date.toLocaleTimeString();
              oModel.refresh(true);

            }, 1000);
            
            
              var that = this;
              // var sPath= oEvent.getParameter('listItem').getBindingContextPath();
              // var formId = sap.ui.getCore().byId("idDataTable");
              var oModel = this.getView().getModel("allEmpRecords")
              this.getOwnerComponent().getModel().read("/ZRS_LOGIN_TABSet",{
                method:"GET",
                success:function(data){
                  debugger
                  oModel.setData({"data":data.results})
                  that.getView().setModel(oModel);
                }
              })

              var oLeaveModel = this.getView().getModel("notify")
              this.getOwnerComponent().getModel().read("/ZRS_LEAVE_TABSet",{
                method:"GET",
                success:function(data){
                  debugger
                  oLeaveModel.setData({"data":data.results})
                  that.getView().setModel(oLeaveModel);
                }
              })
          
            
            
          },
          TimeFormatter:function()
          {
            var date = new Date()
            
            return date.getDate()+"/"+parseInt(date.getMonth()+1)+"/"+date.getFullYear();
          },
          // Dateormatter:function(oValue)
          // {
            
          //   var date = new Date()
          //   return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
          // },
          oSaveEmpdata:function(){
            debugger
            var EmpData = this.getView().getModel("allEmpRecords").oData.data

            var name = sap.ui.getCore().byId("EmpNameView").getValue()
            var phone = sap.ui.getCore().byId("EmpPhoneView").getValue()
            var email = sap.ui.getCore().byId("EmpMailView").getValue()
            var desig = sap.ui.getCore().byId("EmpDesigView").getValue()
            
            EmpData[oEditEmp].name = name
            EmpData[oEditEmp].phone = phone
            EmpData[oEditEmp].email = email
            EmpData[oEditEmp].designation = desig

            this.getView().getModel("allEmpRecords").refresh(true)
            this.EmpDetailsView.destroy(true)
            this.EmpDetailsView = null


          },
          onLogOut:function(){
            this.getOwnerComponent().getRouter().navTo("Routehome",null,true)


          },
          handleClose1:function()
          {
            var demoToast = this.getView().byId("demoToast");
            demoToast.setText("UserId Password");
            demoToast.close();
          },
          handleClose:function()
          {
            var demoToast = this.getView().byId("demoToast");
            demoToast.setText("UserId Text");
            demoToast.close();
          },
          oNotificationClose:function(oEvent)
          {
              var oItem = oEvent.getSource(),
              oList = oItem.getParent().removeItem(oItem);
              sap.m.MessageToast.show("Item Closed: " + oItem.getTitle());
          },


          ViewEmployee:function(){
            
              if(!this.viewEmp){
                this.viewEmp =new sap.ui.xmlfragment("application.fragments.viewEmp",this)
                this.getView().addDependent(this.viewEmp)
              }
            
            this.viewEmp.open()
          },
          viewEmpCloseButton:function(){
            this.viewEmp.close()
            this.viewEmp.destroy(true)

          },


          onReadEmpData:function(oEvent){
            debugger
            if(!this.DelEmp){
              this.DelEmp =new sap.ui.xmlfragment("application.fragments.DelEmp",this)
              this.getView().addDependent(this.DelEmp)
              var that = this;
              // var sPath= oEvent.getParameter('listItem').getBindingContextPath();
              // var formId = sap.ui.getCore().byId("idDataTable");
              var oModel = this.getView().getModel("allEmpRecords")
              this.getOwnerComponent().getModel().read("/ZRS_LOGIN_TABSet",{
                method:"GET",
                success:function(data){
                  debugger
                  oModel.setData({"data":data.results})
                  that.getView().setModel(oModel);
                }
              })

            }
            // this.DelEmp.rerender()
            this.DelEmp.open()

          },

          oEmpClose:function(){

            this.DelEmp.close()


          },
          onDeleteMultiData:function(oEvent){
              debugger
              var that = this;

              this.deletePath=oEvent.oSource._aSelectedPaths
              var oModel = this.getOwnerComponent().getModel("allEmpRecords")
              var oTableId= sap.ui.getCore().byId("idDataTable");
              var selectOneItem = oTableId.getSelectedItems()

              var object =[];
              for (var i=0; i<selectOneItem.length; i++){
                var oSelectedRows = {
                 
                  "EmpName":selectOneItem[i].getBindingContext('allEmpRecords').getObject().EmpName,
                  "EmpPhone":selectOneItem[i].getBindingContext('allEmpRecords').getObject().EmpPhone,
                  "EmpEmail":selectOneItem[i].getBindingContext('allEmpRecords').getObject().EmpEmail,
                  "EmpAge":selectOneItem[i].getBindingContext('allEmpRecords').getObject().EmpAge,
                  "EmpDesignation":selectOneItem[i].getBindingContext('allEmpRecords').getObject().EmpDesignation,
                  "EmpBloodGroup":selectOneItem[i].getBindingContext('allEmpRecords').getObject().EmpBloodGroup,
                  "EmpId":selectOneItem[i].getBindingContext('allEmpRecords').getObject().EmpId
                };
                object.push(oSelectedRows)
              }

              var oModel1 = this.getOwnerComponent().getModel();
              oModel1.setUseBatch(true);
              for (var i=0; i<object.length; i++){
                var oEntry = object[i].EmpId;
                oModel1.remove("/ZRS_LOGIN_TABSet('" + oEntry + "')",
                {
                  method:"DELETE",
                  success:function(response){
                      debugger
                      MessageToast.show("data deleted successfully")
                      that.refreshFun();
                  }

                })
              }
              oModel1.submitChanges({
                success:function(data, response){

                },
                error:function(e){

                }
              })
    


          },
          refreshFun:function(){
            debugger
            var that = this;
              // var sPath= oEvent.getParameter('listItem').getBindingContextPath();
              // var formId = sap.ui.getCore().byId("idDataTable");
              var oModel = this.getView().getModel("allEmpRecords")
              this.getOwnerComponent().getModel().read("/ZRS_LOGIN_TABSet",{
                method:"GET",
                success:function(data){
                  debugger
                  oModel.setData({"data":data.results})
                  that.getView().setModel(oModel);
                }
              })
        },
          AddEmployee:function()
          {    
            this.AddEmpPopUp =new sap.ui.xmlfragment("application.fragments.AddEmpPopUp",this)
            this.getView().addDependent(this.AddEmpPopUp)
         
            this.AddEmpPopUp.open()
          },


          AddEmpCloseButton:function()
          {
            this.AddEmpPopUp.close()
            this.AddEmpPopUp.destroy(true)
          
          },

         
          onNotify:function(){
           debugger
            this.HRNotification =new sap.ui.xmlfragment("application.fragments.HRNotification",this)
            this.getView().addDependent(this.HRNotification)
            this.HRNotification.rerender();

            this.HRNotification.open()            
          },


          hrNotifyCloseButton:function(){

            this.HRNotification.close()
            this.HRNotification.destroy(true);

          },


          leaveTableSelect:function(oEvent){
            debugger
            this.notificationPath=oEvent.oSource._aSelectedPaths


          },
         
          
          ApproveLeave:function(oEvent){
            debugger
            //  sap.ui.getCore().byId("rejectbutton").setEnabled(false)
            // this.HRNotification.rerender()
            // this.HRNotification.open()

            //for Emp temprory notification model
            var allEmpNotification = []
            var allEmpNotificationModel = this.getView().getModel("allEmpNotification")
            allEmpNotification = allEmpNotificationModel.oData.data
            
            var approveLeave=[]
            approveLeave=this.getView().getModel("notify").oData.data

            
            // for(var i=0;i<=this.notificationPath.length-1;i++)
            //   {
            //           var sPath = this.notificationPath[i]
                      var sPath = oEvent.getParameters().id[oEvent.getParameters().id.length-1]
                      
                      // if(approveLeave[sPath].Status=="Approved" && localStorage.getItem("EMPID")==approveLeave[sPath].EmpID)
                      // {
                      //         sap.m.MessageToast.show("Already approved.!")
                             
                      // }
                    //  if(approveLeave[sPath].Status=="Pending" && localStorage.getItem("EMPID")==approveLeave[sPath].EmpID)
                    //   {
                            approveLeave[sPath].Status="Approved"
                            sap.m.MessageToast.show("Approved.!")

                            debugger
                            var approvedArr = []

                            var aModel = this.getView().getModel("approvedLeaves")
                            approvedArr = aModel.oData.data
                            
                                
                            approvedArr.push({
                              "Empid":approveLeave[sPath].EmpID,
                              "status":"Approved",
                              "leaveType":approveLeave[sPath].leaveType,
                              "Days":approveLeave[sPath].NoOfDays
                            })

                            aModel.setData({data:approvedArr})

                            this.getView().setModel(aModel)

                            
                            //for AllEmpnoticationmodel
                            var rand=Math.random()*1000;
                            var rand2= Math.trunc(rand)

                            allEmpNotification.push({
                              "Empid":approveLeave[sPath].EmpID,
                              "status":"Approved",
                              "leaveType":approveLeave[sPath].leaveType,
                              "Days":approveLeave[sPath].NoOfDays,
                              "NotifyId":approveLeave[sPath].EmpID+"Notify"+rand2
                            })
                            allEmpNotificationModel.refresh(true)
                          
                      
                           var lType = approveLeave[sPath].leaveType
                           var Eid = approveLeave[sPath].EmpID
                           var days = approveLeave[sPath].NoOfDays

                           var empRec = []
                          var eModel = this.getView().getModel("allEmpRecords")
                              empRec = eModel.oData.data
                            for(var i=0;i<=empRec.length-1;i++)
                            {
                              if(Eid == empRec[i].userId )
                              {
                                if(lType == "Sick Leave")
                                {
                                  empRec[i].SickLeave = empRec[i].SickLeave-days
                                  empRec[i].Leavebalance =empRec[i].Leavebalance-days

                                }
                                else if(lType == "Casual Leave")
                                {
                                  empRec[i].CasualLeave = empRec[i].CasualLeave-days
                                  empRec[i].Leavebalance =empRec[i].Leavebalance-days
                                }
                              }
                            }

                            eModel.setData({data:empRec})
                            this.getView().setModel(eModel)
                                
                      // }
                      
                      
                      // Deleting the request from the notification..

                      this.getView().getModel("notify").oData.data.splice(sPath,1)
                      this.getView().getModel("notify").refresh(true)
                      
                      

              // }
              

      },   
    
     RejectLeave:function(oEvent){

        debugger
      //  sap.ui.getCore().byId("").enabled = "false"
      // sap.m.MessageToast.show("Rejected")


      var allEmpNotification = []
      var allEmpNotificationModel = this.getView().getModel("allEmpNotification")
      allEmpNotification = allEmpNotificationModel.oData.data


      var approveLeave=[]
          approveLeave=this.getView().getModel("notify").oData.data
            
            // for(var i=0;i<=this.notificationPath.length-1;i++)
            //   {
            //           var sPath = this.notificationPath[i]
                      var sPath = oEvent.getParameters().id[oEvent.getParameters().id.length-1]
                      
                     
                    //  if(approveLeave[sPath].Status=="Rejected" && localStorage.getItem("EMPID")==approveLeave[sPath].EmpID){
                        
                    //         sap.m.MessageToast.show(" already Rejected.!")
               
                            
                 
                    //   }
                      // if(approveLeave[sPath].Status=="Pending" && localStorage.getItem("EMPID")==approveLeave[sPath].EmpID)
                      // {      
                              approveLeave[sPath].Status="Rejected"
                          
                              sap.m.MessageToast.show("Rejected.!")

                            debugger
                            var approvedArr = []

                            var aModel = this.getView().getModel("approvedLeaves")
                            approvedArr = aModel.oData.data
                           
 
                            approvedArr.push({

                              "Empid":approveLeave[sPath].EmpID,
                              "status":"Rejected",
                              "leaveType":approveLeave[sPath].leaveType,
                              "Days":approveLeave[sPath].NoOfDays

                            })
                            aModel.setData({data:approvedArr})
                            this.getView().setModel(aModel)

                            //for AllEmpnoticationmodel

                            var rand=Math.random()*1000;
                            var rand2= Math.trunc(rand)

                            allEmpNotification.push({
                              "Empid":approveLeave[sPath].EmpID,
                              "status":"Rejected",
                              "leaveType":approveLeave[sPath].leaveType,
                              "Days":approveLeave[sPath].NoOfDays,
                              "NotifyId":approveLeave[sPath].EmpID+"Notify"+rand2
                            })
                            allEmpNotificationModel.refresh(true)



                      // }
                      
                            
                                

              // }

            

              this.getView().getModel("notify").oData.data.splice(sPath,1)
              this.getView().getModel("notify").refresh(true)
            

      },
      onClose:function(){
        this.AddEmpPopUp.close()
            this.AddEmpPopUp.destroy(true)

      },
          
      Addname:function(){
        var UserName = sap.ui.getCore().byId('UserName').getValue()
        if(UserName=="")
        {
          sap.ui.getCore().byId("UserName").setValueState("Error")
          sap.ui.getCore().byId('UserName').setValueStateText("UserName cannot be empty")
        }
        else if(UserName!="")
        {
          sap.ui.getCore().byId("UserName").setValueState("None")
          // sap.ui.getCore().byId('UserName').setValueStateText("UserName cannot be empty")
        }
      },

      Addphone:function(){
        var UserPhone =  sap.ui.getCore().byId('UserPhone').getValue()
        if(UserPhone=="")
        {
          sap.ui.getCore().byId("UserPhone").setValueState("Error")
          sap.ui.getCore().byId('UserPhone').setValueStateText("User phone cannot be empty")
        }
        else if(UserPhone!="")
        {
          sap.ui.getCore().byId("UserPhone").setValueState("None")
          
        }

      },
      Addemail:function(){
        if(UserEmail=="")
        {
          sap.ui.getCore().byId("UserEmail").setValueState("Error")
          sap.ui.getCore().byId('UserEmail').setValueStateText("User Email cannot be empty")
        }
        else if(UserEmail!="")
        {
          sap.ui.getCore().byId("UserEmail").setValueState("None")
          
        }
      },
      Addage:function(){
        if(UserAge=="")
        {
          sap.ui.getCore().byId("UserAge").setValueState("Error")
          sap.ui.getCore().byId('UserAge').setValueStateText("User age cannot be empty")
        }
        else if(UserAge!="")
        {
          sap.ui.getCore().byId("UserAge").setValueState("None")
          
        }
      },
      desig:function(){
        if(UserDesignation=="")
        {
          sap.ui.getCore().byId("UserDesignation").setValueState("Error")
          sap.ui.getCore().byId('UserDesignation').setValueStateText("User designation cannot be empty")
        }
        else if(UserDesignation!="")
        {
          sap.ui.getCore().byId("UserDesignation").setValueState("None")
          
        }
      },
      blood:function(){
        if(UserBloodGroup=="")
        {
          sap.ui.getCore().byId("UserBloodGroup").setValueState("Error")
          sap.ui.getCore().byId('UserBloodGroup').setValueStateText(" blood group cannot be empty")
        }
        else if(UserBloodGroup!="")
        {
          sap.ui.getCore().byId("UserBloodGroup").setValueState("None")
          
        }
      },


          //add emp page validation
          AddEmpData:function(){
            debugger
            var UserName = sap.ui.getCore().byId('UserName').getValue()
            var UserPhone =  sap.ui.getCore().byId('UserPhone').getValue()
            var UserEmail = sap.ui.getCore().byId('UserEmail').getValue()
            var UserAge=sap.ui.getCore().byId('UserAge').getValue()
            var UserDesignation=sap.ui.getCore().byId('UserDesignation').getValue()
            var UserBloodGroup=sap.ui.getCore().byId('UserBloodGroup').getValue()
            // var UserPassword = sap.ui.getCore().byId('').getValue()


            

            var vall=100
           
            localStorage.setItem("EmpID", Math.round(Math.random()*100));

            
              var UserID= localStorage.getItem("EmpID");
              UserID=parseInt(UserID)
              // this.UserID = parseInt(this.getOwnerComponent().getModel("allEmpRecords").oData.data[this.getOwnerComponent().getModel("allEmpRecords").oData.data.length-1].UserId.split("P")[1])
              this.UserID++;


              var NameVal =/^[A-Za-z]{3,25}$/
              var PhoneVal =/^[7-9][0-9]{9}$/
              var EmailVal =/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/
            


              //validation of add employee




            if(UserName=='' &&UserPhone==''&& UserEmail==''&& UserAge==''&& UserDesignation==''&& UserBloodGroup==''){
              sap.ui.getCore().byId("UserName").setValueState("Error")
              sap.ui.getCore().byId('UserName').setValueStateText("User name cannot be empty")

              sap.ui.getCore().byId("UserPhone").setValueState("Error")
              sap.ui.getCore().byId('UserPhone').setValueStateText("Number Cannot be empty")

              sap.ui.getCore().byId("UserEmail").setValueState("Error")
              sap.ui.getCore().byId('UserEmail').setValueStateText("Email cannot be empty")

              sap.ui.getCore().byId("UserAge").setValueState("Error")
              sap.ui.getCore().byId('UserAge').setValueStateText("Age cannot be empty")

              sap.ui.getCore().byId("UserDesignation").setValueState("Error")
              sap.ui.getCore().byId('UserDesignation').setValueStateText("Select Designation")

              sap.ui.getCore().byId("UserBloodGroup").setValueState("Error")
              sap.ui.getCore().byId('UserBloodGroup').setValueStateText("Select blood group")


              sap.m.MessageToast.show("No Data is Entered")


              }       


             else if(!(NameVal.test(UserName)))
              {
                  sap.ui.getCore().byId("UserName").setValueState("Error")
                  sap.ui.getCore().byId('UserName').setValueStateText("Minimum 3 and Max 25 letters required")

                  sap.ui.getCore().byId("UserEmail").setValueState("None")
                  sap.ui.getCore().byId("UserPhone").setValueState("None")
                  sap.ui.getCore().byId("UserAge").setValueState("None")                   
                  sap.ui.getCore().byId("UserDesignation").setValueState("None")                   
                  sap.ui.getCore().byId("UserBloodGroup").setValueState("None")                   
              
              }
              else if(!(PhoneVal.test(UserPhone)))
              {
              
                  sap.ui.getCore().byId("UserPhone").setValueState("Error")
                  sap.ui.getCore().byId('UserPhone').setValueStateText("Number Must begin 7/8/9 and 10 digit length")

                  sap.ui.getCore().byId("UserName").setValueState("None")
                  sap.ui.getCore().byId("UserEmail").setValueState("None")
                  sap.ui.getCore().byId("UserAge").setValueState("None")
                  sap.ui.getCore().byId("UserDesignation").setValueState("None")  
                  sap.ui.getCore().byId("UserBloodGroup").setValueState("None")  
              }
              else if(!(EmailVal.test(UserEmail)))
              {
                  sap.ui.getCore().byId("UserEmail").setValueState("Error")
                  sap.ui.getCore().byId('UserEmail').setValueStateText("Enter proper email id")

                  sap.ui.getCore().byId("UserName").setValueState("None")
                  sap.ui.getCore().byId("UserPhone").setValueState("None")
                  sap.ui.getCore().byId("UserAge").setValueState("None")
                  sap.ui.getCore().byId("UserDesignation").setValueState("None")
                  sap.ui.getCore().byId("UserBloodGroup").setValueState("None")

              }
              else if(!(UserAge>=18 && UserAge<=100))
              {
                  sap.ui.getCore().byId("UserAge").setValueState("Error")
                  sap.ui.getCore().byId('UserAge').setValueStateText("Enter proper age")
                 
                  sap.ui.getCore().byId("UserName").setValueState("None")
                  sap.ui.getCore().byId("UserPhone").setValueState("None")
                  sap.ui.getCore().byId("UserEmail").setValueState("None")
                  sap.ui.getCore().byId("UserDesignation").setValueState("None")
                  sap.ui.getCore().byId("UserBloodGroup").setValueState("None")

              }
              else if(UserDesignation=='')
              {
                  sap.ui.getCore().byId("UserDesignation").setValueState("Error")
                  sap.ui.getCore().byId('UserDesignation').setValueStateText("Select Designation")

                  sap.ui.getCore().byId("UserName").setValueState("None")
                  sap.ui.getCore().byId("UserPhone").setValueState("None")
                  sap.ui.getCore().byId("UserEmail").setValueState("None")
                  sap.ui.getCore().byId("UserAge").setValueState("None")
                  sap.ui.getCore().byId("UserBloodGroup").setValueState("None")

              }
              else if(UserBloodGroup=='')
              {
                  sap.ui.getCore().byId("UserBloodGroup").setValueState("Error")
                  sap.ui.getCore().byId('UserBloodGroup').setValueStateText("Select blood group")

                  sap.ui.getCore().byId("UserName").setValueState("None")
                  sap.ui.getCore().byId("UserPhone").setValueState("None")
                  sap.ui.getCore().byId("UserEmail").setValueState("None")
                  sap.ui.getCore().byId("UserAge").setValueState("None")
                  sap.ui.getCore().byId("UserDesignation").setValueState("None")


              }

              else{
                sap.ui.getCore().byId("UserName").setValueState("None")
                sap.ui.getCore().byId("UserPhone").setValueState("None")
                sap.ui.getCore().byId("UserEmail").setValueState("None")
                sap.ui.getCore().byId("UserAge").setValueState("None")
                sap.ui.getCore().byId("UserDesignation").setValueState("None")
                sap.ui.getCore().byId("UserBloodGroup").setValueState("None")

                var oModel = this.getView().getModel("allEmpRecords")
                var empRecords = oModel.oData.data
 
                if(empRecords.some((v)=>{return v.EmpPhone==UserPhone}))
                {
              
                sap.m.MessageToast.show(UserPhone+" "+"user number already registered")

                }
                else if(empRecords.some((v)=>{return v.EmpEmail==UserEmail}))
                {
             
                sap.m.MessageToast.show(UserEmail+" "+"user email already registered")

                }
                else{
                 
                  

                  sap.ui.getCore().byId("UserName").setValue("")
                  sap.ui.getCore().byId("UserPhone").setValue("")
                  sap.ui.getCore().byId("UserEmail").setValue("")
                  sap.ui.getCore().byId("UserAge").setValue("")
                  sap.ui.getCore().byId("UserDesignation").setValue("")
                  sap.ui.getCore().byId("UserBloodGroup").setValue("")
                  sap.m.MessageToast.show("Employee added successfully")

                  var oModel = this.getView().getModel("allEmpRecords")
                  var empRecords = oModel.oData.data

                  empRecords.push({
                        "name":UserName,
                        "phone":UserPhone,
                        "email":UserEmail,
                        "age":UserAge,
                        "designation":UserDesignation,
                        "bloodgroup":UserBloodGroup,
                        "userId":"EMP"+this.UserID,
                        "empPass":"Default@1234",
                        "CasualLeave":10,
                        "SickLeave":8,
                        "Leavebalance":18,
                        "image":"https://tse1.mm.bing.net/th?id=OIP.8pQGc1uvCGFkeniunEv1rwHaHa&pid=Api&P=0"
                        
                    })
                 
                    oModel.setData({data:empRecords})

                    this.getView().setModel(oModel)
                }
                var oEmpData = {};
                oEmpData.EmpName=UserName
                oEmpData.EmpPhone=UserPhone
                oEmpData.EmpEmail=UserEmail
                oEmpData.EmpAge=UserAge
                oEmpData.EmpDesignation=UserDesignation
                oEmpData.EmpBloodGroup=UserBloodGroup
                oEmpData.EmpPassword = "Default@1234"
                oEmpData.EmpCasualLeave = "10"
                oEmpData.EmpSickLeave = "8"
                oEmpData.EmpLeaveBalance = "18"
                oEmpData.EmpId = "EMP"+localStorage.getItem("EmpID")

                this.getOwnerComponent().getModel().create("/ZRS_LOGIN_TABSet", oEmpData,
                {
                  method:"POST",
                  success: function(response){
                    debugger
                    sap.m.MessageToast.show("Employee Data Is Created Succesfully")
                    sap.ui.getCore().byId('UserIdText').setText(localStorage.getItem("EMPID"))
                  sap.ui.getCore().byId('IdPanel').setVisible(true)

                  sap.ui.getCore().byId('EmpIdPass').setText("Default@1234")
                  },
                  Error:function(response){
                    debugger
                  
                  }
                })
                



            }       
    
        },
        oEmpDetailView:function(oEvent){
          debugger
          // var sPath = 
          // var oSelected = oEvent.mParameters.id[oEvent.mParameters.id.length-1]
          // oEditEmp = oSelected // for setting editing emp row
          // var EmpData = this.getView().getModel("allEmpRecords").oData.data

          if(!this.EmpDetailsView){
            this.EmpDetailsView =new sap.ui.xmlfragment("application.fragments.EmpDetailsView",this)
            this.getView().addDependent(this.EmpDetailsView)
                var sPath= oEvent.getSource().getBindingContextPath()
                var formId = sap.ui.getCore().byId("idReadSimpleForm")
                formId.bindElement('allEmpRecords>'+ sPath);

            // sap.ui.getCore().byId("EmpIdView").setValue(EmpData[oSelected].userId)
            // sap.ui.getCore().byId("EmpNameView").setValue(EmpData[oSelected].name)
            // sap.ui.getCore().byId("EmpPhoneView").setValue(EmpData[oSelected].phone)
            // sap.ui.getCore().byId("EmpMailView").setValue(EmpData[oSelected].email)
            // sap.ui.getCore().byId("EmpDesigView").setValue(EmpData[oSelected].designation)
            // sap.ui.getCore().byId("EmpBloodView").setValue(EmpData[oSelected].bloodgroup)
            // sap.ui.getCore().byId("EmpAgeView").setValue(EmpData[oSelected].age)

            this.deletePath=sPath
            this.EmpDetailsView.open()
          }
        
          
        },
        oEmpViewFargmentClose:function()
        {
          this.EmpDetailsView.destroy(true)
          this.EmpDetailsView = null
        },
        
        // oDeleteEmp:function(oEvent){
          
        //   debugger
        //   this.oValue = oEvent.mParameters.listItem.sId[oEvent.mParameters.listItem.sId.length-1]
          
          // if(!this.ConfirmDel)
          // {
          //   this.ConfirmDel =new sap.ui.xmlfragment("application.fragments.ConfirmDel",this)
          //   this.getView().addDependent(this.ConfirmDel)
          //   this.ConfirmDel.open()

        //   }

        // onDeletePopUp:function(){
        //   debugger
        //   if (!this.ConfirmDel){
        //     this.ConfirmDel= new sap.ui.xmlfragment("application.fragments.ConfirmDel",this)
        //     this.getView().addDependent(this.ConfirmDel)
        //     this.ConfirmDel.open()

        //   }
      
         
        // },
          
   

        onDeletePopUp:function(){
          debugger
          var oModel= this.getView().getModel("allEmpRecords")
          var empId = sap.ui.getCore().byId("EmpIdView").getValue();
          this.getOwnerComponent().getModel().remove("/ZRS_LOGIN_TABSet('" + empId + "')",
          {
            method:"DELETE",
            success: function(){
              MessageToast.show("data deleted successfully")
              
            },
            error:function(){
              MessageToast.show("error")
            },
            
           
          }) 
          this.onAfterRendering()

          // var Alldata = []
          // Alldata = this.getView().getModel("allEmpRecords").oData.data

          // var oModel = this.getView().getModel("allEmpRecords")

          // Alldata.splice(this.oValue,1)
          // oModel.setData({data:Alldata})
          // this.getView().setModel(oModel)
          
          // this.ConfirmDel.destroy()
          // this.ConfirmDel=null
          this.EmpDetailsView.destroy(true)
          this.EmpDetailsView = null
          

        },

        onUpdate:function(){
          debugger
          var empId= sap.ui.getCore().byId("EmpIdView").getValue();
          var empName= sap.ui.getCore().byId("EmpNameView").getValue();
          var empPhone= sap.ui.getCore().byId("EmpPhoneView").getValue();
          var empEmail= sap.ui.getCore().byId("EmpMailView").getValue();
          var empAge= sap.ui.getCore().byId("EmpAgeView").getValue();
          var empDesi= sap.ui.getCore().byId("EmpDesiView").getValue();
          var empBloodGroup= sap.ui.getCore().byId("EmpBloodView").getValue();

          var oUpdateEmpData = {}
          oUpdateEmpData.EmpId=empId
          oUpdateEmpData.EmpName=empName
          oUpdateEmpData.EmpPhone=empPhone
          oUpdateEmpData.EmpEmail=empEmail
          oUpdateEmpData.EmpAge=empAge
          oUpdateEmpData.EmpDesignation=empDesi
          oUpdateEmpData.EmpBloodGroup=empBloodGroup
         
          var oModel = this.getView().getModel('allEmpRecords');
          this.getOwnerComponent().getModel().update("/ZRS_LOGIN_TABSet('" + empId + "')",
          oUpdateEmpData,{
            method:"PUT",
            success:function(data){
              debugger
              MessageToast.show("Data Updated Successfully")
            },
            error:function(e){

            }
          })
          
          this.EmpDetailsView.destroy(true)
          this.EmpDetailsView = null
        },




        oCloseDeleteProup:function(){

          this.ConfirmDel.destroy(true)
          this.ConfirmDel = null

        },
        onLiveSearch:function(oSearchEvent){

          debugger
              var searchbyempid = oSearchEvent.getParameter("query");
              if (!searchbyempid){
                  var searchbyempid = oSearchEvent.getParameter("newValue")
              };
              var oFilterByEmpId = new sap.ui.model.Filter("EmpId", sap.ui.model.FilterOperator.Contains,searchbyempid)
            

              var aFilter = [];
              aFilter.push(oFilterByEmpId)

            
              var oTableId= sap.ui.getCore().byId("idDataTable");                 
              var oBinding =oTableId.getBinding("items")
              oBinding.filter(aFilter)
        },
        

        onPressDesignation:function(){
          debugger
          var selectedDesignationKey = sap.ui.getCore().byId("designationsearchid").getSelectedKey();
          var oModel = this.getView().getModel("allEmpRecords");
          var oContext = this ;
         
          var arr = new Array();
           var oDataModel = this.getOwnerComponent().getModel();
          oDataModel.callFunction(
            "/SelectByDesignation",{
              method:"GET",
              urlParameters:{
                EmpDesignation : selectedDesignationKey

              },
              success:function(oData,response){
                debugger
                arr=oData.results
                oModel.setData({"data":arr})
                oContext.getView().setModel(oModel,"allEmpRecords");

              },
              error:function(e){

              }
            }
          )

        }


          
      });
  });

  
