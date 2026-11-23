/**
 * Bande de mots-clés défilante — même mécanique que la bande des
 * partenaires du hero (défilement continu de droite à gauche, points
 * de séparation, fondu sur les bords), en déclinaison claire :
 * fond blanc, texte noir. Elle sépare la section « Approche
 * journalistique » de la section « Productions sélectionnées ».
 */
export function KeywordsBand({
  keywords,
  label,
}: {
  keywords: string[];
  label: string;
}) {
  return (
    <aside aria-label={label} className="dt-keywords-band">
      <div className="dt-keywords">
        <div className="dt-keywords-track">
          {[0, 1].map((setIndex) => (
            <ul
              key={setIndex}
              className="dt-keywords-set"
              aria-hidden={setIndex === 1 ? true : undefined}
            >
              {keywords.map((keyword) => (
                <li key={keyword}>
                  {keyword}
                  <i className="dt-keywords-dot" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </aside>
  );
}
