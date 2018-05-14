import PropTypes from 'prop-types'

export const subResponseMapInterface = PropTypes.shape({
  question: PropTypes.string.isRequired,
  answer: PropTypes.string
})

export const responseMapInterface = PropTypes.arrayOf(PropTypes.shape({
  question: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  creatorId: PropTypes.string.isRequired,
  answer: PropTypes.string,
  subResponses: PropTypes.arrayOf(subResponseMapInterface)
}))

export const optionsInterface = PropTypes.arrayOf(PropTypes.shape({
  title: PropTypes.string.isRequired,
  nextQuestionId: PropTypes.number
}))

export const subQuestionsInterface = PropTypes.arrayOf(PropTypes.shape({
  question: PropTypes.string.isRequired,
  inputType: PropTypes.string.isRequired,
  options: optionsInterface
}))

export const questionInterface = (next, options, sub) => PropTypes.shape({
  questionId: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  inputType: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  nextQuestionId: PropTypes.number[next ? 'isRequired' : ''],
  externalData: PropTypes.string,
  options: optionsInterface[options ? 'isRequired' : ''],
  subQuestions: subQuestionsInterface[sub ? 'isRequired' : '']
}).isRequired
