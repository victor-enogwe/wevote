import PropTypes from 'prop-types'

export const subResponseMapInterface = PropTypes.shape({
  question: PropTypes.string.isRequired,
  answer: PropTypes.string
})

export const responseInterface = PropTypes.shape({
  questionId: PropTypes.string.isRequired,
  creatorId: PropTypes.string.isRequired,
  answer: PropTypes.string,
  subResponses: PropTypes.arrayOf(subResponseMapInterface)
})

export const responseMapInterface = PropTypes.arrayOf(responseInterface)

export const optionsInterface = PropTypes.arrayOf(PropTypes.shape({
  title: PropTypes.string.isRequired,
  nextQuestionId: PropTypes.string,
  score: PropTypes.number.isRequired
}))

export const subQuestionsInterface = PropTypes.arrayOf(PropTypes.shape({
  question: PropTypes.string.isRequired,
  inputType: PropTypes.string.isRequired,
  options: optionsInterface
}))

export const questionInterface = (next, options, sub) => PropTypes.shape({
  questionId: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  inputType: PropTypes.string.isRequired,
  nextQuestionId: PropTypes.string[next ? 'isRequired' : ''],
  externalData: PropTypes.string,
  options: optionsInterface[options ? 'isRequired' : ''],
  subQuestions: subQuestionsInterface[sub ? 'isRequired' : '']
}).isRequired
