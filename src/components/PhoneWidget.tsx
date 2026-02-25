import { sendMetrikaGoal, metrikaGoals } from '@/utils/metrika';

const PhoneWidget = () => {
  const handlePhoneClick = () => {
    sendMetrikaGoal(metrikaGoals.PHONE_CLICK);
  };

  return (
    <a
      href="tel:+79115302020"
      className="fixed bottom-4 left-4 z-50 text-white hover:text-white/80 transition-all hover:scale-110 font-medium text-sm md:text-base"
      aria-label="Позвонить"
      onClick={handlePhoneClick}
    >
      +7 (911) 530-20-20
    </a>
  );
};

export default PhoneWidget;