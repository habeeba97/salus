import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import type { LessonQuiz as LessonQuizData } from '../content';
import { AppText } from './AppText';
import { Card } from './Card';
import { Button } from './Button';
import { Tag } from './Tag';

export function LessonQuiz({ quiz }: { quiz: LessonQuizData }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quiz.questions[current];

  if (finished) {
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <Card tone="soft">
        <Tag label="LESSON COMPLETE" />
        <AppText variant="h2" header>
          🎉 Great work!
        </AppText>
        <AppText variant="h3" header>
          Your score: {score}/{quiz.questions.length} ({percentage}%)
        </AppText>
        <AppText>
          You have finished this lesson quiz. Review the lesson and try again whenever you want.
        </AppText>
        <Button
          label="Try again"
          onPress={() => {
            setCurrent(0);
            setSelected(null);
            setScore(0);
            setFinished(false);
          }}
        />
      </Card>
    );
  }

  const answered = selected !== null;
  const correct = selected === question.correctOptionId;

  const choose = (id: string) => {
    if (answered) return;
    setSelected(id);
    if (id === question.correctOptionId) {
      setScore((value) => value + 1);
    }
  };

  const next = () => {
    if (current === quiz.questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrent((value) => value + 1);
    setSelected(null);
  };

  return (
    <View style={{ gap: 14 }}>
      <AppText variant="h2" header>
        🧠 {quiz.title}
      </AppText>

      <AppText tone="secondary">{quiz.description}</AppText>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Tag label={`Question ${current + 1} of ${quiz.questions.length}`} />
        <Tag label={`Score: ${score}`} />
      </View>

      <Card>
        <AppText variant="h3" header>
          {question.question}
        </AppText>

        <View style={{ gap: 10 }}>
          {question.options.map((option) => {
            const isSelected = selected === option.id;
            const isCorrect = option.id === question.correctOptionId;

            return (
              <Pressable
                key={option.id}
                onPress={() => choose(option.id)}
                disabled={answered}
                style={{
                  padding: 16,
                  borderWidth: 1,
                  borderRadius: 14,
                  opacity: answered && !isSelected && !isCorrect ? 0.65 : 1,
                }}
              >
                <AppText emphasis>
                  {option.id.toUpperCase()}. {option.text}
                </AppText>

                {answered && isCorrect ? (
                  <AppText tone="secondary">✓ Correct answer</AppText>
                ) : null}

                {answered && isSelected && !isCorrect ? (
                  <AppText tone="safety">✕ Not quite</AppText>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </Card>

      {answered ? (
        <Card tone={correct ? 'soft' : 'safety'}>
          <AppText variant="h3" header>
            {correct ? '✅ Correct!' : '💡 Let’s learn from it'}
          </AppText>
          <AppText>{question.explanation}</AppText>

          <Button
            label={current === quiz.questions.length - 1 ? 'See my result' : 'Next question'}
            onPress={next}
          />
        </Card>
      ) : (
        <AppText variant="small" tone="secondary">
          Choose an answer to continue.
        </AppText>
      )}
    </View>
  );
}
