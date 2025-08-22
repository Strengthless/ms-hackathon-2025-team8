import { useTranslation } from "react-i18next";

export const useGetTipOfTheDay = () => {
  const { i18n } = useTranslation();

  const tipMocked = {
    en: "Practice the 'sh' sound today! Try saying 'ship', 'shop', and 'wish' out loud.",
  } as const;

  if (i18n.language in tipMocked) {
    return tipMocked[i18n.language as keyof typeof tipMocked];
  }

  return tipMocked.en;
};
