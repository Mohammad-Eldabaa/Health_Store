import * as Yup from "yup";

const registerSchema = Yup.object().shape({
    name: Yup.string().required("الاسم مطلوب"),
    email: Yup.string().email("بريد غير صالح").required("البريد مطلوب"),
    password: Yup.string().min(6, "كلمة المرور قصيرة").required("كلمة المرور مطلوبة"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "كلمة المرور غير متطابقة")
        .required("تأكيد كلمة المرور مطلوب"),
    address: Yup.string().required("العنوان مطلوب"),
    phone: Yup.string().required("رقم الهاتف مطلوب"),
});

export default registerSchema;
