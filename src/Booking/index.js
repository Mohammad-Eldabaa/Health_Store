import { styles } from "./styles.js";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Formik } from "formik";
import ImportantInfo from "./ImportantInfo.js";
import VisitTypeField from "./VisitTypeField.js";
import DatePickerField from "./DatePickerField.js";
import { initialValues, validationSchema, handleSubmit } from "./schema.js";
import InputField from "./InputField.js";
import BookingFormHeader from "./BookingFormHeader.js";
import useAuthStore from "../store/login.js";

const Booking = () => {
  const { CUname, CUphone, CUaddress, CUrole } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <BookingFormHeader />

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <View style={styles.formContent}>
                <InputField
                  label="الاسم الكامل *"
                  icon="person"
                  field={{ name: "fullName", value: values.fullName }}
                  form={{ touched, errors, handleChange, handleBlur }}
                  placeholder="أدخل اسمك الكامل"
                />

                <InputField
                  label="العنوان *"
                  icon="location"
                  field={{ name: "address", value: values.address }}
                  form={{ touched, errors, handleChange, handleBlur }}
                  placeholder="أدخل عنوانك الكامل"
                />

                <InputField
                  label="العمر *"
                  icon="calendar"
                  field={{ name: "age", value: values.age }}
                  form={{ touched, errors, handleChange, handleBlur }}
                  placeholder="أدخل عمرك"
                  keyboardType="numeric"
                />

                <InputField
                  label="رقم الهاتف *"
                  icon="call"
                  field={{ name: "phoneNumber", value: values.phoneNumber }}
                  form={{ touched, errors, handleChange, handleBlur }}
                  placeholder="أدخل رقم هاتفك"
                  keyboardType="phone-pad"
                />

                <DatePickerField
                  field={{ name: "bookingDate", value: values.bookingDate }}
                  form={{ touched, errors, setFieldValue }}
                />

                <VisitTypeField
                  field={{ name: "visitType", value: values.visitType }}
                  form={{ touched, errors, setFieldValue }}
                />

                <InputField
                  label="ملاحظات إضافية"
                  icon="document-text"
                  field={{ name: "notes", value: values.notes }}
                  form={{ touched, errors, handleChange, handleBlur }}
                  placeholder="يرجى وصف الأعراض أو أي مخاوف محددة..."
                  multiline={true}
                  numberOfLines={4}
                />

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}> احجز الأن</Text>
                </TouchableOpacity>

                {CUrole() && (
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { backgroundColor: "#57e56fff", marginTop: 0 },
                    ]}
                    onPress={() => {
                      setFieldValue("address", CUaddress());
                      setFieldValue("fullName", CUname());
                      setFieldValue("age", "24");
                      setFieldValue("phoneNumber", CUphone());
                    }}
                  >
                    <Text style={styles.submitButtonText}> ملئ تلقائى</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Formik>
        </View>

        <ImportantInfo />
        <View style={{ height: 65 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Booking;
