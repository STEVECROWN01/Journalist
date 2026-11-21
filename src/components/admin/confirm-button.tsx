"use client";

/**
 * Bouton de soumission avec confirmation — permet d'utiliser confirm()
 * dans des formulaires rendus par des composants serveur.
 */
export function ConfirmButton({
  children,
  confirmText,
  className,
  ariaLabel,
  title,
}: {
  children: React.ReactNode;
  confirmText: string;
  className?: string;
  ariaLabel?: string;
  title?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      aria-label={ariaLabel}
      title={title}
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
