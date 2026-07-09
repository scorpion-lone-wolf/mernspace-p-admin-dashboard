function LoginPage() {
  return (
    <>
      <h1>Sign in</h1>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <label htmlFor="remember">Remember me</label>
      <input type="checkbox" name="remember" id="remember" />
      <button type="submit">Log in</button>
      <p>Forgot password</p>
    </>
  );
}

export default LoginPage;
