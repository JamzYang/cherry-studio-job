import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@renderer/store';
import { useMessageOperations, useTopicMessages } from '@renderer/hooks/useMessageOperations';
import { prepareTopicMessages, sendMessage } from '@renderer/store/messages';
import { Assistant, Topic, Message } from '@renderer/types';
import { getDefaultAssistant } from '@renderer/services/AssistantService'; // Assuming this service exists
import Messages from '../home/Messages/Messages'; // Import the Messages component

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 100%; // Ensure container takes full height
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; // Prevent content overflow
`;

const TranscriptionArea = styled.div`
  height: 150px; // Placeholder height
  border: 1px solid #ccc;
  margin-bottom: 20px;
  padding: 10px;
  overflow-y: auto;
`;

const ChatArea = styled.div`
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
  overflow-y: auto; // Make chat area scrollable
`;

const ControlsArea = styled.div`
  margin-top: 20px;
  // Add styles for control buttons
`;


const InterviewerPage: React.FC = () => {
  const dispatch = useAppDispatch();
  // Use a fixed assistant and topic for the interviewer for now
  const defaultAssistant = getDefaultAssistant(); // Assuming a default assistant getter
  const [interviewerTopic, setInterviewerTopic] = useState<Topic | null>(null);

  // Effect to load or create the interviewer topic
  useEffect(() => {
    // In a real scenario, you might load a specific interviewer topic
    // For now, let's create a simple placeholder topic
    const topicId = 'interviewer-session-topic'; // Unique ID for interviewer topic
    const placeholderTopic: Topic = {
      id: topicId,
      name: '面试官会话',
      assistantId: defaultAssistant.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [] // Messages will be loaded by prepareTopicMessages
    };
    setInterviewerTopic(placeholderTopic);
    dispatch(prepareTopicMessages(placeholderTopic));

    // Clean up when component unmounts (optional, depending on desired behavior)
    // return () => {
    //   dispatch(clearTopicMessages(topicId));
    // };
  }, [dispatch, defaultAssistant.id]);

  const messages = useTopicMessages(interviewerTopic || { id: '' } as Topic); // Provide a placeholder topic if null
  const { updateMessages } = useMessageOperations(interviewerTopic || { id: '' } as Topic); // Provide a placeholder topic if null

  // Placeholder function to handle sending a message (e.g., from transcription)
  const handleSendMessage = (content: string) => {
    if (!interviewerTopic) return;

    const userMessage: Message = {
      id: Date.now().toString(), // Simple unique ID
      topicId: interviewerTopic.id,
      role: 'user',
      content: content,
      createdAt: Date.now().toString(), // Convert to string
      status: 'success',
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }, // Placeholder usage
      files: [],
      mentions: []
    };

    // Dispatch the sendMessage thunk
    dispatch(sendMessage(userMessage, defaultAssistant, interviewerTopic));
  };


  return (
    <Container>
      <Title>面试官功能</Title>
      <ContentArea>
        <TranscriptionArea>
          {/* 音频转录文本显示区域 */}
          <p>转录文本将显示在这里...</p>
        </TranscriptionArea>
        <ChatArea>
          {/* 聊天界面，显示转录文本和答案提示 */}
          {/* Using the Messages component for chat display */}
          {interviewerTopic && (
             <Messages
               assistant={defaultAssistant}
               topic={interviewerTopic}
               setActiveTopic={setInterviewerTopic} // Pass the state setter
             />
          )}
        </ChatArea>
      </ContentArea>
      <ControlsArea>
        {/* 音频控制按钮等 */}
        <button onClick={() => console.log('开始/暂停录音')}>开始/暂停录音</button>
        {/* 示例：手动发送消息 */}
        <button onClick={() => handleSendMessage('这是一个测试问题')}>发送测试问题</button>
      </ControlsArea>
    </Container>
  );
};

export default InterviewerPage;
