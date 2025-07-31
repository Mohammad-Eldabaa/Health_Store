import * as Yup from "yup";

const loginSchema = Yup.object().shape({
    email: Yup.string().email("بريد غير صالح").required("البريد مطلوب"),
    password: Yup.string().required("كلمة المرور مطلوبة"),
});

export default loginSchema;