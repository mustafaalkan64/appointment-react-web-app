import background from "../img/login-page-background-images-hd-10.jpg";

const cardStyle = {
  width: "100%",
  boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)",
};

const headStyle = {
  textAlign: "center",
  fontSize: "19px",
};

const loginStyle = {
  paddingTop: 150,
  backgroundImage: `url(${background})`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  width: "100vw",
  height: "100vh",
};

const registerStyle = {
  paddingTop: 100,
  backgroundImage: `url(${background})`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "repeat",
  // width: "100vw",
  height: "100%",
};

export { cardStyle, headStyle, loginStyle, registerStyle };
