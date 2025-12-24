import { motion, AnimatePresence } from 'framer-motion';

interface SpeechBubbleProps {
  message: string;
  isSuccess: boolean;
  visible: boolean;
}

const SpeechBubble = ({ message, isSuccess, visible }: SpeechBubbleProps) => {
  if (!visible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`absolute -top-24 left-1/2 -translate-x-1/2 z-[60] min-w-[200px] max-w-[280px]`}
    >
      <div
        className={`speech-bubble text-center text-sm font-bold`}
        style={{
          borderWidth: '3px',
          ['--bubble-bg' as any]: isSuccess ? 'var(--secondary)' : 'var(--primary)',
          ['--bubble-border' as any]: isSuccess ? 'var(--secondary)' : 'var(--primary)',
          ['--bubble-fg' as any]: isSuccess ? 'var(--secondary-foreground)' : 'var(--primary-foreground)',
        }}
      >
        {message}
      </div>
    </motion.div>
  );
};

export default SpeechBubble;
