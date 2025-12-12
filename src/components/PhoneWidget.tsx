const PhoneWidget = () => {
  return (
    <a
      href="tel:+79999999999"
      className="fixed bottom-4 left-4 z-50 text-primary hover:text-primary/80 transition-all hover:scale-110 font-medium text-sm md:text-base"
      aria-label="Позвонить"
    >
      +7 (999) 999-99-99
    </a>
  );
};

export default PhoneWidget;
