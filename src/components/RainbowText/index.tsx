import clsx from 'clsx';

interface RainbowTextProps {
  text: string;
  className?: string;
}

const colors = [
  '#FF0000', // red
  '#FF7F00', // orange
  '#FFFF00', // yellow
  '#00FF00', // green
  '#0000FF', // blue
  '#4B0082', // indigo
  '#8B00FF', // violet
];

export default function RainbowText({ text, className }: RainbowTextProps) {
  return (
    <span className={clsx(className)}>
      {text.split('').map((char, idx) => (
        <span key={idx} style={{ color: colors[idx % colors.length] }}>
          {char}
        </span>
      ))}
    </span>
  );
} 