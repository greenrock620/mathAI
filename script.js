// 配置API参数（必须修改）
const API_KEY = '0154612d-b2a1-4fa6-a644-a58a97a79496'; // 替换为火山引擎获取的真实密钥
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
// DOM元素

// 公共cors-anywhere代理URL
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

const btn = document.getElementById('generateBtn');
const questionText = document.getElementById('questionText');
const loader = document.querySelector('.loader');
// 生成题目函数
async function generateQuestion() {
    try {
        // 显示加载状态
        btn.disabled = true;
        questionText.textContent = '';
        loader.style.display = 'block';
        // 调用API
        const response = await fetch(proxyUrl+API_URL, {
            method: 'POST',
           //mode: 'cors', // 明确声明跨域模式
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-r1-250120",
                messages: [{
                    role: "user",
                    content: "生成一道小学三年级数学题"
                }],
            })
        });
       
       


        // 修改响应处理逻辑（假设API返回结构为火山引擎标准格式）
        const data = await response.json();
        // 提取题目内容
        const content = data.choices?.[0]?.message?.content || "";

        // 使用正则表达式提取题目部分
        const questionMatch = content.match(/\*\*题目：\*\*\s*([\s\S]*?)\n\n/);
        const question = questionMatch ? questionMatch[1].trim() : "未找到题目";

        // 显示题目
        questionText.textContent = question;


    } catch (error) {
        console.error('发生错误:', error);
        questionText.textContent = '题目生成失败，请点击按钮重试';
    } finally {
        btn.disabled = false;
        loader.style.display = 'none';
    }
}
// 绑定事件
btn.addEventListener('click', generateQuestion);
// 页面加载时生成第一题
window.addEventListener('load', generateQuestion);
