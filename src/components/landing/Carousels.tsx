import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface Testimonial {
  company: string;
  person: string;
  role: string;
  text: string;
  img: string;
  stats: { speed: string; quality: string; period: string };
  rating: number;
  letterText: string;
}

interface TeamMember {
  name: string;
  role: string;
  spec: string;
  exp: string;
  hires: string;
  img: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

interface TeamCarouselProps {
  teamMembers: TeamMember[];
}

export const TestimonialsCarousel = ({ testimonials }: TestimonialsCarouselProps) => {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 4000, stopOnInteraction: false })]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-6">
        {testimonials.map((testimonial, idx) => (
          <div key={idx} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 px-3">
            <Card className="glass-dark overflow-hidden hover:neon-glow transition-all h-full">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                <img src={testimonial.img} alt={testimonial.person} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-bold text-lg text-white drop-shadow-lg">{testimonial.company}</h3>
                  <p className="text-sm text-white/90 drop-shadow-md">{testimonial.person} • {testimonial.role}</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Icon key={i} name="Star" size={16} className="text-accent fill-accent" />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                <div className="relative glass p-4 rounded-lg border border-primary/20 overflow-hidden">
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{ 
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                    }}></div>
                  </div>
                  
                  <div className="relative space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="FileCheck" size={16} className="text-primary" />
                          <p className="text-xs font-bold uppercase tracking-wider text-primary">Благодарственное письмо</p>
                        </div>
                        <p className="text-sm font-bold mb-2">{testimonial.company}</p>
                        <p className="text-xs text-muted-foreground/90 leading-relaxed">
                          {testimonial.letterText}
                        </p>
                      </div>
                      
                      <div className="relative ml-4 flex-shrink-0">
                        <div className="w-20 h-20 rounded-full border-4 border-primary/40 flex items-center justify-center bg-gradient-to-br from-primary/30 to-secondary/30 relative">
                          <Icon name="Stamp" size={28} className="text-primary" />
                          <div className="absolute inset-0 rounded-full opacity-20" style={{
                            background: 'radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.4), transparent)'
                          }}></div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg">
                          <Icon name="Award" size={16} className="text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-border/30">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 border-2 border-primary/50">
                          <AvatarImage src={testimonial.img} alt={testimonial.person} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                            {testimonial.person.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-xs font-bold">{testimonial.person}</div>
                          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{testimonial.stats.speed}</div>
                    <div className="text-xs text-muted-foreground">найден</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary">{testimonial.stats.quality}</div>
                    <div className="text-xs text-muted-foreground">качество</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">{testimonial.stats.period}</div>
                    <div className="text-xs text-muted-foreground">работает</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TeamCarousel = ({ teamMembers }: TeamCarouselProps) => {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 3500, stopOnInteraction: false })]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-6">
        {teamMembers.map((member, idx) => (
          <div key={idx} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 px-3">
            <Card className="glass-dark p-6 space-y-4 hover:neon-glow transition-all h-full">
              <Avatar className="w-24 h-24 mx-auto border-4 border-primary/50 neon-glow">
                <AvatarImage src={member.img} alt={member.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl">
                  {member.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-2">
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <Badge className="bg-primary/20 text-primary">{member.spec}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">{member.exp}</div>
                  <div className="text-xs text-muted-foreground">опыта</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-secondary">{member.hires}</div>
                  <div className="text-xs text-muted-foreground">найма</div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
