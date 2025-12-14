declare global {
  interface Window {
    ym?: (id: number, method: string, target?: string, params?: any) => void;
  }
}

export const sendMetrikaGoal = (goalName: string, params?: any) => {
  if (window.ym) {
    window.ym(105720131, 'reachGoal', goalName, params);
  }
};

export const metrikaGoals = {
  FORM_SUBMIT: 'form_submit',
  PHONE_CLICK: 'phone_click',
  CALCULATOR_OPEN: 'calculator_open',
  CALCULATOR_SUBMIT: 'calculator_submit',
  VACANCY_VIEW: 'vacancy_view',
  CTA_CLICK: 'cta_click',
  LEAD_CREATED: 'lead_created',
  STAGE_COMPLETED: 'stage_completed'
};
