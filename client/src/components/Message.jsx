// Renders errors or successfull transactions on the screen.
function Message({ content }) {
  return <div role="alert">{content}</div>;
}
export default Message;
