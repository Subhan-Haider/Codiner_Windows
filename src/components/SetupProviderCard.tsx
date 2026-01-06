import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type SetupProviderVariant = "google" | "openrouter" | "codiner";

export function SetupProviderCard({
  variant,
  title,
  subtitle,
  chip,
  leadingIcon,
  onClick,
  tabIndex = 0,
  className,
}: {
  variant: SetupProviderVariant;
  title: string;
  subtitle?: string;
  chip?: ReactNode;
  leadingIcon: ReactNode;
  onClick: () => void;
  tabIndex?: number;
  className?: string;
}) {
  const styles = getVariantStyles(variant);

  return (
    <div
      className={cn(
        "p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 relative hover:shadow-lg hover:scale-[1.02]",
        styles.container,
        className,
      )}
      onClick={onClick}
      role="button"
      tabIndex={tabIndex}
    >
      {chip && (
        <div
          className={cn(
            "absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold",
            styles.subtitleColor,
            "bg-white/90 dark:bg-black/30 backdrop-blur-sm shadow-sm",
          )}
        >
          {chip}
        </div>
      )}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-lg", styles.iconWrapper)}>
            {leadingIcon}
          </div>
          <div>
            <h4 className={cn("font-semibold text-lg", styles.titleColor)}>
              {title}
            </h4>
            {subtitle ? (
              <div
                className={cn(
                  "text-sm mt-0.5 flex items-center gap-1 font-medium",
                  styles.subtitleColor,
                )}
              >
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>
        <ChevronRight className={cn("w-5 h-5", styles.chevronColor)} />
      </div>
    </div>
  );
}

function getVariantStyles(variant: SetupProviderVariant) {
  switch (variant) {
    case "google":
      return {
        container:
          "bg-blue-500/5 border-blue-200 dark:border-blue-700/50 hover:bg-blue-500/10 backdrop-blur-sm",
        iconWrapper: "bg-blue-100 dark:bg-blue-800/50",
        titleColor: "text-blue-800 dark:text-blue-300",
        subtitleColor: "text-blue-600 dark:text-blue-400",
        chevronColor: "text-blue-600 dark:text-blue-400",
      } as const;
    case "openrouter":
      return {
        container:
          "bg-teal-500/5 border-teal-200 dark:border-teal-700/50 hover:bg-teal-500/10 backdrop-blur-sm",
        iconWrapper: "bg-teal-100 dark:bg-teal-800/50",
        titleColor: "text-teal-800 dark:text-teal-300",
        subtitleColor: "text-teal-600 dark:text-teal-400",
        chevronColor: "text-teal-600 dark:text-teal-400",
      } as const;
    case "codiner":
      return {
        container:
          "bg-indigo-500/5 border-indigo-200 dark:border-indigo-700/50 hover:bg-indigo-500/10 backdrop-blur-sm",
        iconWrapper: "bg-indigo-100 dark:bg-indigo-800/50",
        titleColor: "text-indigo-800 dark:text-indigo-300",
        subtitleColor: "text-indigo-600 dark:text-indigo-400",
        chevronColor: "text-indigo-600 dark:text-indigo-400",
      } as const;
  }
}

export default SetupProviderCard;
