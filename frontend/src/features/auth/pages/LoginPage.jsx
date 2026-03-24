import AuthForm from "../components/AuthForm";
import { loginUser } from "../authAPI";
import { setAccessToken } from "../authService";

const LoginPage = () => {
  const handleLogin = async (formData) => {
    try {
      const data = await loginUser(formData);
      setAccessToken(data.accessToken);
      console.log("Login success");
    } catch (err) {
      console.error(err);
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
};

export default LoginPage;
