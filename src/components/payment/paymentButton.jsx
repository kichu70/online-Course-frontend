import axios from 'axios'
import { toast } from 'react-toastify';

export const handlePayment =async (courseId,token)=>{
        try{
            // const courseArray =Array.isArray(course)? course :[course];
            const {data} =await axios.post(`${process.env.NEXT_PUBLIC_FETCH_DATA_URL}/payment/create-checkout-session?courseId=${courseId}`,{},{
                
                  headers: { Authorization: `Bearer ${token}` },
            },
            )
            window.location.href =data.url
        }
        catch(err){
            console.log(err);
            toast.error("Payemnt failed!")
        }
    };

