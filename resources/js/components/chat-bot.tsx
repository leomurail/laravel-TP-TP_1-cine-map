import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Bot, Settings2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: 'assistant', content: 'Bonjour ! Je suis votre assistant CineMap. Comment puis-je vous aider aujourd\'hui ?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash-lite');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now(), role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ 
                    message: userMsg.content,
                    model: selectedModel
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 429) {
                    toast.error("Quota API dépassé. Veuillez patienter.");
                } else {
                    toast.error(errorData.response || "Une erreur est survenue.");
                }
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const assistantMsg: Message = { 
                id: Date.now() + 1, 
                role: 'assistant', 
                content: data.response 
            };
            setMessages(prev => [...prev, assistantMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                role: 'assistant', 
                content: "Désolé, j'ai rencontré une erreur. Veuillez réessayer plus tard." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen ? (
                <Button 
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform bg-primary text-primary-foreground"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            ) : (
                <Card className="w-80 sm:w-96 h-[500px] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
                    <CardHeader className="flex flex-row items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary" />
                            <span className="font-semibold text-sm">Assistant CineMap</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Select value={selectedModel} onValueChange={setSelectedModel}>
                                <SelectTrigger className="h-8 w-[140px] text-[10px] border-none shadow-none focus:ring-0">
                                    <SelectValue placeholder="Model" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite</SelectItem>
                                    <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                                    <SelectItem value="gemini-1.5-flash-latest">Gemini 1.5 Flash</SelectItem>
                                    <SelectItem value="gemini-1.5-pro-latest">Gemini 1.5 Pro</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                        : 'bg-muted text-foreground rounded-tl-none shadow-sm'
                                }`}>
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-muted rounded-2xl px-3 py-2 text-sm rounded-tl-none">
                                    <div className="flex gap-1 items-center h-4">
                                        <div className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="p-3 border-t">
                        <div className="flex w-full gap-2">
                            <Input 
                                placeholder="Posez votre question..." 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="flex-1"
                            />
                            <Button size="icon" onClick={handleSend} disabled={isLoading}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
