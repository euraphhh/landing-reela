/** marca do beatstars (o "B" com a estrela), monocromática para seguir o preto e branco do site */
export function BeatstarsB({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 292 318" width="1em" height="1.09em" fill="currentColor" fillRule="evenodd" aria-hidden="true" focusable="false">
      <path d="M0 0H253L292 37V130L272 150V168L292 188V281L253 318H0Z M60 59H230V258H60Z M148 82L166.2 134.9L222.2 135.9L177.5 169.6L193.8 223.1L148 191L102.2 223.1L118.5 169.6L73.8 135.9L129.8 134.9Z" />
    </svg>
  );
}
