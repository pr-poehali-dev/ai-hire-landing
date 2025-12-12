const PhoneWidget = () => {
  return (
    <a
      href="tel:+79955556231"
      className="fixed bottom-4 left-4 z-50 text-white hover:text-white/80 transition-all hover:scale-110 font-medium text-sm md:text-base"
      aria-label="Позвонить"
    >
      +7 (995) 555-62-31
    </a>
  );
};

export default PhoneWidget;