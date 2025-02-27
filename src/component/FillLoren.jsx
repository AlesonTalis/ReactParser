import { Typography } from '@mui/material';

// Custom component to generate lorem ipsum text
export default function FillLoren({ paragraph = 1 }) {
  const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
  return (
    <>
      {Array.from({ length: paragraph }).map((_, idx) => (
        <Typography key={idx}>{text.repeat(5)}</Typography>
      ))}
    </>
  );
}
