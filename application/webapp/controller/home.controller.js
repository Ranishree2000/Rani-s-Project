sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
	MessageToast) {
        "use strict";

        return Controller.extend("application.controller.home", {
           
            EmpLogId:null,
            onInit: function () {
                debugger
                
                var myCarosule = this.getView().byId("HomeCarousel")
                setInterval(function () { myCarosule.next(); }, 2500);
            },
            onAfterRendering:function(){
                debugger;
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
            loginempname:function(){
                debugger
                var Empname = this.getView().byId('empname').getValue()
                if(Empname=='')
                {
                    this.getView().byId('empname').setValueState('Error')
                    this.getView().byId('empname').setValueStateText("Enter your Employee Id")

                }
                else if(Empname!='')
                {
                    this.getView().byId('empname').setValueState('None')

                }

            },
            loginPassword:function(){
                var Password = this.getView().byId('Password').getValue()
                if(Password=='')
                {
                    // this.getView().byId('empname').setValueState('None')

                    this.getView().byId('Password').setValueState('Error')
                    this.getView().byId('Password').setValueStateText("Enter your Password")

                }
               else if(Password!='')
                {
                    

                    this.getView().byId('Password').setValueState('None')
                   

                }

            },


            oLogin:function(oEvent){
                debugger

                var oArry = []
                oArry =  this.getView().getModel("allEmpRecords").oData.data

                var Empname = this.getView().byId('empname').getValue()
                var Password = this.getView().byId('Password').getValue()

                if(Empname=='' && Password=='' )
                {
                    this.getView().byId('empname').setValueState('Error')
                    this.getView().byId('Password').setValueState('Error')
                    this.getView().byId('empname').setValueStateText("Enter your Employee Id")
                    this.getView().byId('Password').setValueStateText("Enter your Password")
                }
                else if(Empname=='Admin' && Password=='12345' )
                {
                    this.getView().byId('empname').setValueState('None')
                    this.getView().byId('Password').setValueState('None')
                    this.getView().byId('empname').setValue('')
                    this.getView().byId('Password').setValue('')
                    this.getOwnerComponent().getRouter().navTo("RouteHRPage",null,true)
                }
                else if((oArry.some((v)=>{ return ((v.EmpId==Empname) && (v.EmpPassword==Password) && (!(v.EmpPassword=="Default@1234")) ) } )))
                {   
                    // globalId=v.EmpId 
                    localStorage.setItem("EMPID",Empname)
                    this.getView().byId('empname').setValue('')
                    this.getView().byId('Password').setValue('')

                this.getOwnerComponent().getRouter().navTo("RouteEmpPage",{
                    id1:Empname
                    
                },true)


                    var LogEmpArr = new Array()

                    var LogEmpArr = this.getView().getModel("allEmpRecords").oData.data

                    
                    for(var i=0;i<=LogEmpArr.length-1;i++)
                    {
                        if(Empname == LogEmpArr[i].EmpId)
                        {

                            var mySampleArr = []
                            mySampleArr = {
                                "name":LogEmpArr[i].name,
                                "phone":LogEmpArr[i].phone,
                                "email":LogEmpArr[i].email,
                                "age":LogEmpArr[i].age,
                                "designation":LogEmpArr[i].designation,
                                "bloodgroup":LogEmpArr[i].bloodgroup,
                                "userId":LogEmpArr[i].userId,
                                "sickleave":LogEmpArr[i].SickLeave,
                                "casualleave":LogEmpArr[i].CasualLeave,
                                "Leavebalance":LogEmpArr[i].Leavebalance
                            }

                            var oModel = this.getView().getModel("approvedLeave")
                            oModel.setData(mySampleArr)
                            this.getView().setModel(oModel)
                        }
                    }

                    for(var i=0;i<=LogEmpArr.length-1;i++)
                    {
                        if(Empname == LogEmpArr[i].EmpId)
                        {
                            var arr = new Array()
                            var oModel = this.getView().getModel("profile")
                            arr = LogEmpArr[i].image
                            oModel.setData(arr,"img")
                            this.getView().setModel(oModel)

                        }
                    }        
        
              var Profilearr = new Array()

              Profilearr = this.getView().getModel("profile").getData().data
              var empid = localStorage.getItem("EMPID")
                 
              
                    if(Profilearr.length == 0)
                    {
                        let arr0 = new Array()
                        let oModel0 = this.getView().getModel("profilePic")
      
                        arr0 = {
                          "img" : "https://tse1.mm.bing.net/th?id=OIP.8pQGc1uvCGFkeniunEv1rwHaHa&pid=Api&P=0"
                        }
      
                        oModel0.setData(arr0)
                        this.getView().setModel(oModel0)
                    }
                    else{

                        Profilearr.some((v)=>{
                        
                            if(empid == v.id)
                            {
                                for(var i=0;i<=Profilearr.length-1;i++)
                                {
                                    if(empid == Profilearr[i].id)
                                    {
                                    let arr = new Array()
                                    var oModel = this.getView().getModel("profilePic")

                                    arr = {

                                        "img" : Profilearr[i].img
                                    }

                                    oModel.setData(arr)
                                    this.getView().setModel(oModel)
                                    }
                                
                                }
                            }
                        })
                    }
            }    
                else if((oArry.some((v)=>{ return ((v.EmpId==Empname) && (v.EmpPassword==Password) ) } )))
                {
                    this.getView().byId('empname').setValue('')
                    this.getView().byId('Password').setValue('')
                    this.PasswordChange =new sap.ui.xmlfragment("application.fragments.PasswordChange",this)
                    this.getView().addDependent(this.PasswordChange)
                    this.EmpLogId = Empname
                    sap.ui.getCore().byId("EmpIdConfirm").setValue(this.EmpLogId)
                    this.PasswordChange.open()
                }
                

                   
        },
        



            oldpass:function(){
               var OldPass =  sap.ui.getCore().byId("oldPassword").getValue()
               if(OldPass=="")
               {
                sap.ui.getCore().byId("oldPassword").setValueState("Error")
               }
               else if(OldPass!="")
               {
                sap.ui.getCore().byId("oldPassword").setValueState("None")

               }


            },

            newpass:function(){
                var NewPass =  sap.ui.getCore().byId("PasswordReset").getValue()
                if(NewPass=="" ){
                    sap.ui.getCore().byId("PasswordReset").setValueState("Error")

                }
               

                else if(NewPass!=""){
                    sap.ui.getCore().byId("PasswordReset").setValueState("None")

                }

            },
            ConfirmPassword:function(){
                var ConfPass = sap.ui.getCore().byId("ConfirmPassword").getValue()
                if(ConfPass==""){
                sap.ui.getCore().byId("ConfirmPassword").setValueState("Error")


                }
                else if(ConfPass!=""){
                sap.ui.getCore().byId("ConfirmPassword").setValueState("None")

                    
                }
            },

            resetPassword:function()
            {
                debugger

                //  var passVal=/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{4}$/


                var oArry = new Array()
                oArry =  this.getView().getModel("allEmpRecords").oData.data

               var NewPass =  sap.ui.getCore().byId("PasswordReset").getValue()
               var OldPass =  sap.ui.getCore().byId("oldPassword").getValue()
               var ConfPass = sap.ui.getCore().byId("ConfirmPassword").getValue()

          


             if(NewPass!=ConfPass )
            {
                 sap.ui.getCore().byId("PasswordReset").setValueState("Error")
                 sap.ui.getCore().byId("ConfirmPassword").setValueState("Error")
              

                  sap.ui.getCore().byId('ConfirmPassword').setValueStateText("password is not matching")

                  MessageToast.show("Password not matching")


            }
            else if(NewPass=='' && ConfPass=='' && OldPass=='Default@1234'){
                sap.ui.getCore().byId("PasswordReset").setValueState("Error")
                sap.ui.getCore().byId("ConfirmPassword").setValueState("Error")
                sap.ui.getCore().byId("oldPassword").setValueState("None")

                sap.ui.getCore().byId('PasswordReset').setValueStateText("password cannot be blank")
                sap.ui.getCore().byId('ConfirmPassword').setValueStateText("password cannot be blank")
                MessageToast.show("Password cannot be blank")

            }
            else if(OldPass!="Default@1234")
            {
                sap.ui.getCore().byId("oldPassword").setValueState("Error")
               
                sap.ui.getCore().byId('oldPassword').setValueStateText("Enter valid password")

                
            }

            
               else if(OldPass=="Default@1234" && NewPass==ConfPass)
               {
                sap.ui.getCore().byId("PasswordReset").setValueState("None")
                sap.ui.getCore().byId("ConfirmPassword").setValueState("None")
                sap.ui.getCore().byId("oldPassword").setValueState("None")

             

            
                for(var i=0;i<=oArry.length-1;i++)
                {


                    if(oArry[i].EmpId==this.EmpLogId)
                    {
                        debugger

                        oArry[i].EmpPassword = NewPass   

                        this.getOwnerComponent().getModel().update("/ZRS_LOGIN_TABSet('"+this.EmpLogId+"')",
                        oArry[i],
                        {
                          method:"PATCH",
                          success:function(data){
                            debugger
                            MessageToast.show("Password Updated Successfully")
                          },
                          error:function(e){
              
                          }
                        })
                       
                        MessageToast.show("Password successfully set")

                        this.getView().getModel("allEmpRecords").refresh(true)
                        // oModel.setData(oArry)
                        // this.getView().setModel(oModel)
                        this.PasswordChange.close()
                        this.PasswordChange.destroy(true) 
                        this.PasswordChange = null
                    }
                }
            } 
            },
           
            oLogin1:function(){
               this.getOwnerComponent().getRouter().navTo("RouteEmpPage")


            },
            oLogin11:function(){
                this.PasswordChange =new sap.ui.xmlfragment("application.fragments.PasswordChange",this)
                this.getView().addDependent(this.PasswordChange)
             
                this.PasswordChange.open()

            },
            
            closeLogin:function(){
                this.PasswordChange.close()
                this.PasswordChange.destroy(true)


            },
          
        });
    });

    

            
        

    