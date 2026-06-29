const LogoIcon = ({ size = "md" }) => {
  const imgSize = size === "sm" ? "w-5 h-5" : "w-6 h-6 md:w-7 md:h-7";

  return (
    <img src="/icon.png" alt="PopFlix icon" className={`${imgSize} object-contain`} />
  );
};

export default LogoIcon;
