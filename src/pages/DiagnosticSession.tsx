import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Question {
  id: string;
  question: string;
  placeholder: string;
  explanation?: string;
}

interface Block {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  questions: Question[];
}

const diagnosticBlocks: Block[] = [
  {
    id: 'symptoms',
    title: 'Симптомы и контекст',
    subtitle: 'Что видно на поверхности?',
    icon: 'stethoscope',
    color: 'from-red-600 to-orange-600',
    questions: [
      {
        id: 'problem-manifestation',
        question: 'Как внешне проявляется проблема, из-за которой вы задумались о найме?',
        placeholder: 'Опишите последний яркий пример "сбоя"...',
        explanation: 'Нам важно понять конкретные симптомы, а не общие формулировки'
      },
      {
        id: 'who-suffers',
        question: 'Кто больше всего страдает от этой ситуации и почему?',
        placeholder: 'Руководитель, команда, клиенты, другие отделы...',
        explanation: 'Это помогает определить масштаб и приоритет проблемы'
      },
      {
        id: 'previous-attempts',
        question: 'Что вы уже пробовали делать, чтобы это исправить? Почему не сработало?',
        placeholder: 'Вводили KPI, меняли процессы, проводили обучение...',
        explanation: 'Понимание неудачных попыток экономит время и деньги'
      }
    ]
  },
  {
    id: 'system-analysis',
    title: 'Системный анализ процесса',
    subtitle: 'Где на самом деле "рвется"?',
    icon: 'network',
    color: 'from-blue-600 to-cyan-600',
    questions: [
      {
        id: 'ideal-vs-real',
        question: 'Опишите идеальный процесс в этой зоне от начала до конца. А теперь — как он выглядит на самом деле?',
        placeholder: 'Где самое большое расхождение между идеалом и реальностью...',
        explanation: 'Разрыв между ожиданием и реальностью показывает корень проблемы'
      },
      {
        id: 'process-input',
        question: 'Что является "входом" для этого процесса/отдела? Кто и как обеспечивает качество этого "входа"?',
        placeholder: 'Например, для отдела продаж — лиды от маркетинга...',
        explanation: 'Часто проблема кроется в смежном отделе, а не в текущем'
      },
      {
        id: 'process-output',
        question: 'Что является результатом ("выходом") работы? Кто потребитель результата? Довольны ли они?',
        placeholder: 'Другой отдел, клиент, руководство...',
        explanation: 'Качество выхода определяет истинную эффективность'
      },
      {
        id: 'bottleneck',
        question: 'Где в процессе возникает больше всего вопросов, неопределенности, ручного труда или переделок?',
        placeholder: 'Опишите узкое место процесса...',
        explanation: 'Узкие места — это точки приложения усилий для максимального эффекта'
      }
    ]
  },
  {
    id: 'resources',
    title: 'Ресурсы и данные',
    subtitle: 'Чего не хватает для решения?',
    icon: 'database',
    color: 'from-purple-600 to-pink-600',
    questions: [
      {
        id: 'decision-making',
        question: 'Как сейчас принимаются решения в этой проблемной зоне?',
        placeholder: 'На основе данных, интуиции, опыта или указаний сверху...',
        explanation: 'Способ принятия решений влияет на скорость и качество'
      },
      {
        id: 'missing-tools',
        question: 'Какой информации или инструментов не хватает людям, чтобы работать эффективнее?',
        placeholder: 'Нет обратной связи, нет аналитики, непонятны приоритеты...',
        explanation: 'Иногда проблема решается не наймом, а инструментами'
      },
      {
        id: 'magic-ability',
        question: 'Если бы у сотрудников была волшебная способность — какая одна компетенция решила бы 80% проблем?',
        placeholder: 'Не "больше продавать", а "понимать скрытые потребности клиента"...',
        explanation: 'Это и есть ключевая компетенция для поиска специалиста'
      }
    ]
  },
  {
    id: 'org-structure',
    title: 'Оргструктура и коммуникации',
    subtitle: 'Почему система не самоисправляется?',
    icon: 'users',
    color: 'from-green-600 to-emerald-600',
    questions: [
      {
        id: 'decision-point',
        question: 'Где находится точка принятия ключевых решений? Могут ли те, кто сталкивается с проблемой, что-то изменить?',
        placeholder: 'Есть ли у исполнителей полномочия влиять на процесс...',
        explanation: 'Отсутствие полномочий убивает инициативу'
      },
      {
        id: 'department-interaction',
        question: 'Как взаимодействуют отделы? Есть ли "стена непонимания" или конфликт интересов?',
        placeholder: 'Продажи vs. маркетинг, разработка vs. продукт...',
        explanation: 'Межотдельские конфликты — частая причина торможения'
      },
      {
        id: 'talent-blockers',
        question: 'Что мешает нынешним талантливым сотрудникам взять и решить эту проблему?',
        placeholder: 'Нехватка времени, полномочий, мотивации или поддержки...',
        explanation: 'Возможно, у вас уже есть нужные люди, но связаны руки'
      }
    ]
  },
  {
    id: 'goals-culture',
    title: 'Цели и культура',
    subtitle: 'Зачем нам это на самом деле нужно?',
    icon: 'target',
    color: 'from-indigo-600 to-purple-600',
    questions: [
      {
        id: 'business-goal',
        question: 'Как решение этой проблемы связано с главной бизнес-целью компании?',
        placeholder: 'Например, проблема с доставкой убивает NPS и мешает цели стать самым рекомендуемым...',
        explanation: 'Связь с главной целью определяет приоритет инвестиций'
      },
      {
        id: 'real-values',
        question: 'Какой тип поведения и ценностей реально поощряется в компании?',
        placeholder: 'Даже если на стенах написано обратное. Скорость vs качество, результат vs процесс...',
        explanation: 'Новый сотрудник должен соответствовать реальным ценностям, не декларируемым'
      }
    ]
  }
];

export default function DiagnosticSession() {
  const navigate = useNavigate();
  const [currentBlock, setCurrentBlock] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const progress = ((currentBlock + 1) / diagnosticBlocks.length) * 100;
  const block = diagnosticBlocks[currentBlock];

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentBlock < diagnosticBlocks.length - 1) {
      setCurrentBlock(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentBlock > 0) {
      setCurrentBlock(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const allQuestionsAnswered = block.questions.every(q => 
    answers[q.id] && answers[q.id].trim().length > 0
  );

  const exportToPDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById('diagnostic-report');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0a0a0a'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let firstPage = true;

      while (heightLeft >= 0) {
        if (!firstPage) {
          pdf.addPage();
        }
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
        position -= pageHeight;
        firstPage = false;
      }

      pdf.save('diagnostic-session-onedayhr.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const isFinished = currentBlock === diagnosticBlocks.length - 1 && allQuestionsAnswered;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-white/10"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">Стратегическая диагностика</h1>
          </div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <Icon name="Gift" className="mr-1" size={14} />
            Бесплатно
          </Badge>
        </div>
      </header>

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          {currentBlock === 0 && (
            <div className="text-center mb-12 animate-in fade-in duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mb-6">
                <Icon name="Brain" size={40} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Найдём корень проблемы,
                <br />
                <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                  не симптом
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
                Диагностическая сессия выявляет истинную бизнес-задачу. 
                Возможно, вам нужен не новый сотрудник, а изменение процессов.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
                  <Icon name="Clock" className="mr-2" size={16} />
                  40 минут
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                  <Icon name="FileText" className="mr-2" size={16} />
                  PDF-отчёт
                </Badge>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                  <Icon name="Sparkles" className="mr-2" size={16} />
                  AI-анализ
                </Badge>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">
                Блок {currentBlock + 1} из {diagnosticBlocks.length}
              </span>
              <span className="text-sm font-bold text-blue-400">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Block Header */}
          <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border-white/20 p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${block.color} flex items-center justify-center flex-shrink-0`}>
                <Icon name={block.icon as any} size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-black mb-2">{block.title}</h3>
                <p className="text-xl text-gray-300">{block.subtitle}</p>
              </div>
            </div>
          </Card>

          {/* Questions */}
          <div className="space-y-6 mb-8" id="diagnostic-report">
            {block.questions.map((q, idx) => (
              <Card key={q.id} className="bg-white/5 backdrop-blur-lg border-white/10 p-6 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-2">{q.question}</h4>
                    {q.explanation && (
                      <p className="text-sm text-gray-400 mb-4 italic">
                        💡 {q.explanation}
                      </p>
                    )}
                    <Textarea
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswer(q.id, e.target.value)}
                      placeholder={q.placeholder}
                      className="min-h-32 bg-black/30 border-white/20 focus:border-blue-500 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={handlePrev}
              disabled={currentBlock === 0}
              variant="outline"
              size="lg"
              className="border-white/20 hover:bg-white/10"
            >
              <Icon name="ChevronLeft" className="mr-2" size={20} />
              Назад
            </Button>

            {!isFinished ? (
              <Button
                onClick={handleNext}
                disabled={!allQuestionsAnswered}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Далее
                <Icon name="ChevronRight" className="ml-2" size={20} />
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={exportToPDF}
                  disabled={isGenerating}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isGenerating ? (
                    <>
                      <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                      Генерация...
                    </>
                  ) : (
                    <>
                      <Icon name="Download" className="mr-2" size={20} />
                      Скачать PDF
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Icon name="Send" className="mr-2" size={20} />
                  Получить анализ
                </Button>
              </div>
            )}
          </div>

          {/* Bottom Info */}
          {isFinished && (
            <Card className="mt-8 bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl border-blue-500/30 p-8">
              <div className="text-center">
                <Icon name="CheckCircle2" className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h3 className="text-2xl font-bold mb-3">Диагностика завершена!</h3>
                <p className="text-gray-300 mb-6">
                  Наш ИИ проанализирует ваши ответы и сформирует стратегическую рекомендацию 
                  с вариантами решений и точным портретом специалиста, если найм действительно нужен.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-black/30 rounded-lg p-4">
                    <Icon name="FileSearch" className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <div className="text-sm text-gray-400">Диагноз</div>
                    <div className="font-bold">Корневая причина</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <Icon name="Lightbulb" className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <div className="text-sm text-gray-400">Решения</div>
                    <div className="font-bold">3+ варианта</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <Icon name="UserSearch" className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <div className="text-sm text-gray-400">Портрет</div>
                    <div className="font-bold">Точный профиль</div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
