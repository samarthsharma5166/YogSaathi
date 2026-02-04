import axios from "axios";
const token = process.env.WHASTAPP_API
export const sendRegistrationConfirmation = (number, date, name, refferalCode, referralPoints) => {
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "yoga_trial_confirmation__session_access_details",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text": date
                    },
                    {
                        "type": "text",
                        "text": `${process.env.CLASS_BASE_URL}/class/join?ref=${refferalCode}_${referralPoints}`
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log("sendRegistrationConfirmation",response)
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const sendRegistrationConfirmationStep2 = (number, name)=>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "registration_confirmation__batch_details",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log("Message sent sendRegistrationConfirmationStep2:", response);
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const sendRegistrationConfirmationStep3 = (number, name, date, refferalCode, referralPoints)=>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "intimation_first_class",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text": date
                    },
                    {
                        "type": "text",
                        "text": `${process.env.CLASS_BASE_URL}/class/join?ref=${refferalCode}_${referralPoints}`
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log("sendRegistrationConfirmation3",response);
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const reffaralInformation = (number,inviter, invitee) => {
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "referral_update__account_note_added",
        language: "en",
        phoneNumber: number,
        customer_name: inviter,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": inviter
                    },
                    {
                        "type": "text",
                        "text": invitee
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const session_reminder__orientation_for_free_trial = (number, name, date, time, sessionLink) => {
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "session_reminder__orientation_for_free_trial",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text": date
                    },
                    {
                        "type": "text",
                        "text": time
                    },
                    {
                        "type": "text",
                        "text": `${sessionLink}`
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}

// export const class_reminder = (number, name, link, focusArea) =>{
export const class_reminder = (number, name, focusArea, refferalCode, referralPoints) => {

    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "class_reminder",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text": focusArea
                    },
                    {
                        "type": "text",
                        "text": `${process.env.CLASS_BASE_URL}/class/join?ref=${refferalCode}_${referralPoints}`
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const your_weekly_yoga_schedule__access_details = (number, name, monday, tuesday, wednesday, thursday, friday, saturday, sunday, refferalCode, refferalCount ) =>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "your_weekly_yoga_schedule__access_details",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text": monday
                    },
                    {
                        "type": "text",
                        "text": tuesday
                    },
                    {
                        "type": "text",
                        "text": wednesday
                    },
                    {
                        "type": "text",
                        "text": thursday
                    },
                    {
                        "type": "text",
                        "text": friday
                    },
                    {
                        "type": "text",
                        "text": saturday
                    },
                    {
                        "type": "text",
                        "text": sunday
                    },
                    {
                        "type": "text",
                        "text": `${process.env.CLASS_BASE_URL}/class/join?ref=${refferalCode}_${refferalCount}`
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const join_session__mark_attendance = (number, name, refferalCode, refferalCount) => {
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "join_session__mark_attendance",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text": `${process.env.CLASS_BASE_URL}/class/join?ref=${refferalCode}_${refferalCount}`
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });

}

export const session_reminder = (number, name, date, time, sessionLink) =>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "session_reminder",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text": date
                    },
                    {
                        "type": "text",
                        "text": time
                    },
                    {
                        "type": "text",
                        "text": `${sessionLink}`
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });

}

export const giftwellness_yogsaathi = (number,name) =>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "giftwellness_yogsaathi",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text": `${process.env.CLASS_BASE_URL}/price`
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const yoga_subscription_offer = (number,name) =>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "yoga_subscription_offer",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const weekly_attendance_status__yogsaathi_sessions = (number, name, mon,tue,wed,thr,fri,sat,sun) =>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "weekly_attendance_status__yogsaathi_sessions",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text": mon
                    },
                    {
                        "type": "text",
                        "text": tue
                    },
                    {
                        "type": "text",
                        "text": wed
                    },
                    {
                        "type": "text",
                        "text": thr
                    },
                    {
                        "type": "text",
                        "text": fri
                    },
                    {
                        "type": "text",
                        "text": sat
                    },
                    {
                        "type": "text",
                        "text": sun
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const share_wellness_14_days_of_free_yoga = (number, name, referral_code, referral_count) =>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "share_wellness_14daysfreeyoga",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": `${process.env.CLASS_BASE_URL}/auth/register?ref=${referral_code}&refferal_count=${referral_count}&name=${name}`
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const invoice_subscription_plan = (number,name,fileName)=>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "invoice_subscription_plan",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text":`${process.env.BASE_URL_INVOICE}/api/invoices/${fileName}`
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const subscription_invitation = (number,name)=>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "subscription_invitation",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text": `${process.env.CLASS_BASE_URL}/price`
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const your_yogsaathi_otp_for_login =(number,name,otp) =>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "your_yogsaathi_otp_for_login",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": otp
                    }
                ]
            },
            {
                "type": "button",
                "sub_type": "url",
                "index": "0",
                "parameters": [
                    {
                        "type": "text",
                        "text": otp
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });

}

// export const intimation_first_class = (number, name, refferalCode, referralPoints,date)=>{
//     axios.post("https://backend.chatmitra.com/api/client/send_template", {
//         templateName: "intimation_first_class",
//         language: "en",
//         phoneNumber: number,
//         customer_name: name,
//         components: [
//             {
//                 "type": "header",
//                 "parameters": [
//                     {
//                         "type": "image",
//                         "image": {
//                             "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
//                         }
//                     }
//                 ]
//             },
//             {
//                 "type": "body",
//                 "parameters": [
//                     {
//                         "type": "text",
//                         "text": name
//                     },
//                     {
//                         "type": "text",
//                         "text": date
//                     },
//                     {
//                         "type": "text",
//                         "text": `${process.env.CLASS_BASE_URL}/class/join?ref=${refferalCode}_${referralPoints}`
//                     }
//                 ]
//             }
//         ]
//     }, {
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer 15fa2ce18fcc924d167aa3c40d0e4730:402cb6d73f369a822d288b5494fbd374868d0f640c9ce9ee8c0ac822091b9f5bcc5bff29f1522fac7c54dbeebdf1a1a244177b891d5a36262ccea99c3f89bfd231cfefa1182ffdd8534165190c937195234b4e211b7c81bf14401dd8d5bfa0d16abf9cf6fb4bb3ba3706a5d777152b6032705b0e992e6bc1d9f0bd7857e7d34ad25a81d3dd4f1a633fa8c4abaadab23f9b2308dce696731a2af52c539080b79f397a7379732662f262c0e7088faf4c3d0e29c73e648c1e17945c2e6a0383c15e"
//         }
//     }).then(response => {
//         console.log(response.data);
//     }).catch(error => {
//         console.error("Error:", error);
//     });
// }
// completer 


export const vijayadashami_greetings = (number,name)=>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "vijayadashami_greetings",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });

}

export const vijaydashmi_greetings_and_referrals = (number, name, referral_code, referral_count)=>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "vijaydashmi_greetings_and_referrals",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text": `${process.env.CLASS_BASE_URL}/auth/register?ref=${referral_code}&refferal_count=${referral_count}&name=${name}`
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const yoga_trial_midway_update__reminder = (number,name) =>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "yoga_trial_midway_update__reminder",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const yogsaathi_contact_detail = (number,name) =>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "yogsaathi_contact_detail",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const festival_greetings = (number,name) =>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "festival_greetings",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });

}

export const yoga_offer_reminder = (number,name) =>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "yoga_offer_reminder",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });

}

export const yogsaathi_communication_channels = (number,name) =>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "yogsaathi_communication_channels",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 15fa2ce18fcc924d167aa3c40d0e4730:402cb6d73f369a822d288b5494fbd374868d0f640c9ce9ee8c0ac822091b9f5bcc5bff29f1522fac7c54dbeebdf1a1a244177b891d5a36262ccea99c3f89bfd231cfefa1182ffdd8534165190c937195234b4e211b7c81bf14401dd8d5bfa0d16abf9cf6fb4bb3ba3706a5d777152b6032705b0e992e6bc1d9f0bd7857e7d34ad25a81d3dd4f1a633fa8c4abaadab23f9b2308dce696731a2af52c539080b79f397a7379732662f262c0e7088faf4c3d0e29c73e648c1e17945c2e6a0383c15e"
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}



export const free_online_yoga_trial_reminder =(number,name)=>{

    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "free_online_yoga_trial_reminder",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 15fa2ce18fcc924d167aa3c40d0e4730:402cb6d73f369a822d288b5494fbd374868d0f640c9ce9ee8c0ac822091b9f5bcc5bff29f1522fac7c54dbeebdf1a1a244177b891d5a36262ccea99c3f89bfd231cfefa1182ffdd8534165190c937195234b4e211b7c81bf14401dd8d5bfa0d16abf9cf6fb4bb3ba3706a5d777152b6032705b0e992e6bc1d9f0bd7857e7d34ad25a81d3dd4f1a633fa8c4abaadab23f9b2308dce696731a2af52c539080b79f397a7379732662f262c0e7088faf4c3d0e29c73e648c1e17945c2e6a0383c15e"
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}


export const yoga_class_time_details_as_per_ist = (number,name)=>{

    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "yoga_class_time_details_as_per_ist",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 15fa2ce18fcc924d167aa3c40d0e4730:402cb6d73f369a822d288b5494fbd374868d0f640c9ce9ee8c0ac822091b9f5bcc5bff29f1522fac7c54dbeebdf1a1a244177b891d5a36262ccea99c3f89bfd231cfefa1182ffdd8534165190c937195234b4e211b7c81bf14401dd8d5bfa0d16abf9cf6fb4bb3ba3706a5d777152b6032705b0e992e6bc1d9f0bd7857e7d34ad25a81d3dd4f1a633fa8c4abaadab23f9b2308dce696731a2af52c539080b79f397a7379732662f262c0e7088faf4c3d0e29c73e648c1e17945c2e6a0383c15e"
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}


export const yoga_trial_participation_reminder = (number,name,Link)=>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "yoga_trial_participation_reminder",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text": Link
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 15fa2ce18fcc924d167aa3c40d0e4730:402cb6d73f369a822d288b5494fbd374868d0f640c9ce9ee8c0ac822091b9f5bcc5bff29f1522fac7c54dbeebdf1a1a244177b891d5a36262ccea99c3f89bfd231cfefa1182ffdd8534165190c937195234b4e211b7c81bf14401dd8d5bfa0d16abf9cf6fb4bb3ba3706a5d777152b6032705b0e992e6bc1d9f0bd7857e7d34ad25a81d3dd4f1a633fa8c4abaadab23f9b2308dce696731a2af52c539080b79f397a7379732662f262c0e7088faf4c3d0e29c73e648c1e17945c2e6a0383c15e"
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}


export const days_yoga_trial_intimation_hindi = (number,name,link)=>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "21_days_yoga_trial_intimation_hindi",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text": link
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });

}

export const world_meditation_day_greetings = (number,name)=>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "world_meditation_day_greetings",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });

}

export const festival_greetings_christmas_new_year = (number,name) =>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "festival_greetings_christmas_new_year",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 15fa2ce18fcc924d167aa3c40d0e4730:402cb6d73f369a822d288b5494fbd374868d0f640c9ce9ee8c0ac822091b9f5bcc5bff29f1522fac7c54dbeebdf1a1a244177b891d5a36262ccea99c3f89bfd231cfefa1182ffdd8534165190c937195234b4e211b7c81bf14401dd8d5bfa0d16abf9cf6fb4bb3ba3706a5d777152b6032705b0e992e6bc1d9f0bd7857e7d34ad25a81d3dd4f1a633fa8c4abaadab23f9b2308dce696731a2af52c539080b79f397a7379732662f262c0e7088faf4c3d0e29c73e648c1e17945c2e6a0383c15e"
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });

}


export const online_free_yoga_trial__joining_details = (number,name,link) =>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "online_free_yoga_trial__joining_details",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text": link
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 15fa2ce18fcc924d167aa3c40d0e4730:402cb6d73f369a822d288b5494fbd374868d0f640c9ce9ee8c0ac822091b9f5bcc5bff29f1522fac7c54dbeebdf1a1a244177b891d5a36262ccea99c3f89bfd231cfefa1182ffdd8534165190c937195234b4e211b7c81bf14401dd8d5bfa0d16abf9cf6fb4bb3ba3706a5d777152b6032705b0e992e6bc1d9f0bd7857e7d34ad25a81d3dd4f1a633fa8c4abaadab23f9b2308dce696731a2af52c539080b79f397a7379732662f262c0e7088faf4c3d0e29c73e648c1e17945c2e6a0383c15e"
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });

}

// number, name, link, focusArea
export const class_reminder_free_yoga_for_all = (number, name, focusArea, refferalCode, referralPoints)=>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "class_reminder_free_yoga_for_all",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    },
                    {
                        "type": "text",
                        "text": `${process.env.CLASS_BASE_URL}/class/join?ref=${refferalCode}_${referralPoints}`
                    },
                    {
                        "type": "text",
                        "text": focusArea
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 15fa2ce18fcc924d167aa3c40d0e4730:402cb6d73f369a822d288b5494fbd374868d0f640c9ce9ee8c0ac822091b9f5bcc5bff29f1522fac7c54dbeebdf1a1a244177b891d5a36262ccea99c3f89bfd231cfefa1182ffdd8534165190c937195234b4e211b7c81bf14401dd8d5bfa0d16abf9cf6fb4bb3ba3706a5d777152b6032705b0e992e6bc1d9f0bd7857e7d34ad25a81d3dd4f1a633fa8c4abaadab23f9b2308dce696731a2af52c539080b79f397a7379732662f262c0e7088faf4c3d0e29c73e648c1e17945c2e6a0383c15e"
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}

export const subscription_plan_new_year_offer = (number,name)=>{
    axios.post("https://backend.chatmitra.com/api/client/send_template", {
        templateName: "subscription_plan_new_year_offer",
        language: "en",
        phoneNumber: number,
        customer_name: name,
        components: [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {
                            "link": "https://chatmitra.s3.ap-south-1.amazonaws.com/images/1755668233917_logomain.png"
                        }
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    }
                ]
            }
        ]
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 15fa2ce18fcc924d167aa3c40d0e4730:402cb6d73f369a822d288b5494fbd374868d0f640c9ce9ee8c0ac822091b9f5bcc5bff29f1522fac7c54dbeebdf1a1a244177b891d5a36262ccea99c3f89bfd231cfefa1182ffdd8534165190c937195234b4e211b7c81bf14401dd8d5bfa0d16abf9cf6fb4bb3ba3706a5d777152b6032705b0e992e6bc1d9f0bd7857e7d34ad25a81d3dd4f1a633fa8c4abaadab23f9b2308dce696731a2af52c539080b79f397a7379732662f262c0e7088faf4c3d0e29c73e648c1e17945c2e6a0383c15e"
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error:", error);
    });
}