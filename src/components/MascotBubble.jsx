import mascotImage from '../assets/Cute_Animal_3D_Icons/icon 11.png';

export default function MascotBubble() {
  return (
    <div aria-hidden="true" className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-[40px] bg-loot-selected">
      <img className="h-16 w-16 object-contain" src={mascotImage} alt="" />
    </div>
  );
}
