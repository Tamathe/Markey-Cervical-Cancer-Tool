type Props = {
  children: React.ReactNode;
};

/**
 * Desktop: wraps content in an iOS-shaped phone on a dotted paper backdrop.
 * Mobile (< 640px): renders content full-bleed.
 */
export function PhoneFrame({ children }: Props) {
  return (
    <div className="min-h-svh w-full paper-dots flex items-center justify-center p-0 sm:p-6">
      <div
        className="
          w-full max-w-[440px]
          sm:rounded-[40px] sm:overflow-hidden
          sm:phone-shadow sm:border sm:border-[var(--color-rule)]
          bg-white
          h-svh sm:h-[820px] sm:max-h-[90vh]
          flex flex-col
        "
        role="application"
        aria-label="Markey HPV Helper"
      >
        {children}
      </div>
    </div>
  );
}
