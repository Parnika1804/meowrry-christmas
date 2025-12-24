import { motion, AnimatePresence } from 'framer-motion';

interface FloatingBadgeProps {
  type: 'correct' | 'wrong' | 'streak' | 'complete';
  message: string;
  visible: boolean;
  position?: { x: number; y: number };
}

const FloatingBadge = ({ type, message, visible, position = { x: 0, y: 0 } }: FloatingBadgeProps) => {
  const getBadgeStyle = () => {
    switch (type) {
      case 'correct':
        return 'bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground border-secondary/50';
      case 'wrong':
        return 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary/50';
      case 'streak':
        return 'bg-gradient-to-br from-gold to-accent text-accent-foreground border-gold/50';
      case 'complete':
        return 'bg-gradient-to-br from-accent via-gold to-secondary text-accent-foreground border-accent/50';
      default:
        return 'bg-card text-card-foreground border-border';
    }
  };

  const getEmoji = () => {
    switch (type) {
      case 'correct': return '✨';
      case 'wrong': return '💨';
      case 'streak': return '🔥';
      case 'complete': return '🎉';
      default: return '⭐';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: [0, 1.2, 1], 
            y: [20, -10, 0]
          }}
          exit={{ opacity: 0, scale: 0.5, y: -30 }}
          transition={{ duration: 0.4, ease: 'backOut' }}
          className={`fixed z-50 px-4 py-2 rounded-2xl font-display font-bold text-lg shadow-cartoon-lg border-4 ${getBadgeStyle()}`}
          style={{
            left: position.x || '50%',
            top: position.y || '40%',
            transform: position.x ? 'none' : 'translateX(-50%)',
          }}
        >
          <motion.span
            animate={{ rotate: [-8, 8] }}
            transition={{ duration: 0.15, repeat: 6, repeatType: 'reverse' as const, ease: 'easeInOut' }}
            className="inline-block mr-2"
          >
            {getEmoji()}
          </motion.span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingBadge;
