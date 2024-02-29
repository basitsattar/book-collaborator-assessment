import React from "react";

const SectionDetail = ({ section, canEdit }) => {
  return (
    <div>
      <h3>{section.title}</h3>
      {canEdit && <button>Edit</button>}
      {section.subsections &&
        section.subsections.map((subsection) => (
          <SectionDetail
            key={subsection.id}
            section={subsection}
            canEdit={canEdit}
          />
        ))}
    </div>
  );
};

export default SectionDetail;
