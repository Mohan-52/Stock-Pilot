import AuthForm from "../components/AuthForm";
import { registerUser } from "../authAPI";

const RegisterPage = () => {
  const handleRegister = async (formData) => {
    try {
      await registerUser(formData);
      console.log("Register success");
    } catch (err) {
      console.error(err);
    }
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
};

export default RegisterPage;
