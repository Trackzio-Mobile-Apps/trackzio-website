import { motion } from 'framer-motion';
import { COMPANY_ACTIVE_USERS, COMPANY_AVERAGE_RATING, COMPANY_DOWNLOADS } from '@/lib/companyMetrics';

const metrics = [
  { value: COMPANY_DOWNLOADS, label: 'Total Downloads' },
  { value: COMPANY_AVERAGE_RATING, label: 'Average Rating' },
  { value: COMPANY_ACTIVE_USERS, label: 'Active Users' },
];

export default function MetricsBar() {
  return (
    <section className="border-y border-border/20 bg-muted/50" aria-label="Key metrics">
      <div className="container-site py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold font-display text-primary">{m.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
