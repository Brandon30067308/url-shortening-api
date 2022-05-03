module.exports = {
  content: ["./src/**/*.{js,html,ejs}"],
  theme: {
    extend: {
      backgroundImage: {
        shortenDesktop: "url(../images/bg-shorten-desktop.svg)",
        shortenMobile: "url(../images/bg-shorten-mobile.svg)",
        boostDesktop: "url(../images/bg-boost-desktop.svg)",
        boostMobile: "url(../images/bg-boost-mobile.svg)",
      },
      colors: {
        primaryCyan: "hsl(180, 66%, 49%)",
        primaryViolet: "hsl(257, 27%, 26%)",
        red: "hsl(0, 87%, 67%)",
        gray: "hsl(0, 0%, 75%)",
        grayishViolet: "hsl(257, 7%, 63%)",
        lightBlue: "#EFF1F7",
        lightCyan: "hsl(179, 56.3%, 70%)",
        darkBlue: "hsl(255, 11%, 22%)",
        darkViolet: "hsl(260, 8%, 14%)",
        dark: "rgb(35,35,35)",
      },
      fontFamily: {
        poppins: [`'poppins', serif`],
      },
      screens: {
        lg: "1024px",
        "2xl": "1980px",
      },
    },
  },
  plugins: [],
};
