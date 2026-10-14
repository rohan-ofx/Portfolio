
import { Icon } from "@iconify/react";

const SkillIcon = ({ identifier }) => {
  if (!identifier) {
    return <span aria-hidden="true">◆</span>;
  }

  return (
    <Icon
      icon={identifier}
      width={30}
      height={30}
      aria-hidden="true"
    />
  );
};

export default SkillIcon;
