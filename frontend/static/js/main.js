// Main JavaScript functionality for CBOT Requirements Assistant
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const resultsModal = document.getElementById('resultsModal');
    const closeButtons = document.querySelectorAll('.close');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const userLoginForm = document.getElementById('userLoginForm');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const generateBtn = document.getElementById('generateBtn');
    const ldapRadios = document.querySelectorAll('input[name="ldap"]');
    const ldapDetails = document.querySelector('.ldap-details');
    const sendMessageBtn = document.getElementById('sendMessage');
    const userMessageInput = document.getElementById('userMessage');
    const chatMessages = document.getElementById('chatMessages');
    const downloadPdfBtn = document.getElementById('downloadPdf');
    const downloadWordBtn = document.getElementById('downloadWord');

    // Event Listeners
    loginBtn.addEventListener('click', openLoginModal);
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
    tabButtons.forEach(button => {
        button.addEventListener('click', switchTab);
    });
    userLoginForm.addEventListener('submit', handleUserLogin);
    adminLoginForm.addEventListener('submit', handleAdminLogin);
    generateBtn.addEventListener('click', generateRequirements);
    ldapRadios.forEach(radio => {
        radio.addEventListener('change', toggleLdapDetails);
    });
    sendMessageBtn.addEventListener('click', sendMessage);
    userMessageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    downloadPdfBtn.addEventListener('click', downloadPdf);
    downloadWordBtn.addEventListener('click', downloadWord);

    // Window click event to close modal
    window.addEventListener('click', function(e) {
        if (e.target === loginModal || e.target === resultsModal) {
            closeModal();
        }
    });

    // Functions
    function openLoginModal() {
        loginModal.style.display = 'block';
    }

    function closeModal() {
        loginModal.style.display = 'none';
        resultsModal.style.display = 'none';
    }

    function switchTab(e) {
        const tabId = e.target.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to current button and content
        e.target.classList.add('active');
        document.getElementById(tabId + 'Login').classList.add('active');
    }

    function handleUserLogin(e) {
        e.preventDefault();
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        
        // Here you would normally validate credentials with the backend
        console.log(`User login attempt: ${email}`);
        
        // For demo, simply close the modal and show a success message
        closeModal();
        addBotMessage(`Hoş geldiniz, ${email.split('@')[0]}! Modül seçimlerinizi yaparak kurulum gereksinimlerinizi oluşturabilirsiniz.`);
        
        // Update UI to show logged in state
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${email.split('@')[0]}`;
    }

    function handleAdminLogin(e) {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        
        // Here you would normally validate admin credentials with the backend
        console.log(`Admin login attempt: ${email}`);
        
        // For demo, close the modal and redirect to admin panel
        closeModal();
        addBotMessage(`Yönetici girişi başarılı! Yönetici paneline yönlendiriliyorsunuz.`);
        
        // Simulate redirection to admin panel
        setTimeout(() => {
            alert('Bu demo sürümünde yönetici paneli bulunmamaktadır.');
        }, 1500);
    }

    function toggleLdapDetails() {
        if (document.querySelector('input[name="ldap"][value="yes"]').checked) {
            ldapDetails.style.display = 'block';
        } else {
            ldapDetails.style.display = 'none';
        }
    }

    function sendMessage() {
        const message = userMessageInput.value.trim();
        if (message) {
            // Add user message to chat
            addUserMessage(message);
            userMessageInput.value = '';
            
            // Process user message and send to webhook
            processChatbotResponse(message);
        }
    }

    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'bot-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function processChatbotResponse(userMessage) {
        // Kullanıcının mesajını API'ye gönderiyoruz (webhook entegrasyonu)
        fetch('/api/chatbot/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            // API'den gelen cevabı chatbot mesajı olarak gösteriyoruz
            addBotMessage(data.response);
        })
        .catch(error => {
            console.error('Error:', error);
            addBotMessage("Bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.");
        });
    }
    function generateRequirements() {
        // Gather all form data
        const formData = {
            environment: document.querySelector('input[name="environment"]:checked').value,
            environmentType: document.querySelector('input[name="environment_type"]:checked').value,
            coreModules: Array.from(document.querySelectorAll('input[name="core_module"]:checked')).map(el => el.value),
            auxiliaryServices: Array.from(document.querySelectorAll('input[name="auxiliary_service"]:checked')).map(el => el.value),
            database: document.querySelector('input[name="database"]:checked').value,
            ldapEnabled: document.querySelector('input[name="ldap"]:checked').value === 'yes'
        };
        
        // Add LDAP details if enabled
        if (formData.ldapEnabled) {
            formData.ldapDetails = {
                url: document.querySelector('input[name="ldap_url"]').value,
                bindDn: document.querySelector('input[name="bind_dn"]').value,
                searchBase: document.querySelector('input[name="search_base"]').value,
                searchFilter: document.querySelector('input[name="search_filter"]').value
            };
        }
        
        console.log('Form Data:', formData);
        
        // In a real implementation, this would call the backend API to process the form data
        // and generate the requirements document
        
        // For demo, generate a sample requirements document
        const requirementsHtml = generateSampleRequirements(formData);
        
        // Display the requirements document
        document.getElementById('requirementsResults').innerHTML = requirementsHtml;
        resultsModal.style.display = 'block';
        
        // Add a bot message
        addBotMessage("Kurulum gereksinimleri dokümanınız oluşturuldu. PDF veya Word formatında indirebilirsiniz.");
    }

    function generateSampleRequirements(formData) {
        // This function would generate the HTML for the requirements document based on the form data
        // In a real implementation, this would come from the backend API
        
        let requirementsHtml = `
            <div class="requirements-document">
                <h2>CBOT Kurulum Gereksinimleri</h2>
                <p><strong>Oluşturulma Tarihi:</strong> ${new Date().toLocaleString()}</p>
                
                <div class="section">
                    <h3>1. Ortam Bilgileri</h3>
                    <ul>
                        <li><strong>Ortam Tipi:</strong> ${formData.environment === 'both' ? 'Test ve Canlı' : formData.environment.charAt(0).toUpperCase() + formData.environment.slice(1)}</li>
                        <li><strong>Kurulum Ortamı:</strong> ${formData.environmentType === 'on-prem' ? 'On-Premise' : 'Bulut'}</li>
                    </ul>
                </div>
                
                <div class="section">
                    <h3>2. Seçilen Modüller</h3>
                    <ul>
                        ${formData.coreModules.map(module => `<li>${module.charAt(0).toUpperCase() + module.slice(1)}</li>`).join('')}
                    </ul>
                    
                    ${formData.auxiliaryServices.length > 0 ? `
                    <h4>Yardımcı Servisler:</h4>
                    <ul>
                        ${formData.auxiliaryServices.map(service => {
                            let serviceName = service;
                            if (service === 'file_to_md') serviceName = 'File to Markdown';
                            if (service === 'hf_model_hosting') serviceName = 'HF Model Hosting';
                            return `<li>${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}</li>`;
                        }).join('')}
                    </ul>
                    ` : ''}
                </div>
                
                <div class="section">
                    <h3>3. Donanım Gereksinimleri</h3>
                    ${generateHardwareRequirements(formData)}
                </div>
                
                <div class="section">
                    <h3>4. Veritabanı Gereksinimleri</h3>
                    ${generateDatabaseRequirements(formData)}
                </div>
                
                <div class="section">
                    <h3>5. Network / Firewall Gereksinimleri</h3>
                    <ul>
                        <li>Sunucular internet erişimli olmalıdır</li>
                        <li>Veritabanı portları açık olmalıdır (${getDatabasePort(formData.database)})</li>
                        <li>Load Balancer 5000 portunda WebSocket desteği sağlamalıdır</li>
                    </ul>
                    
                    <h4>DNS Kayıtları:</h4>
                    <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
                        <tr>
                            <th>Servis</th>
                            <th>DNS Kaydı</th>
                            <th>Port</th>
                        </tr>
                        ${generateDnsRecords(formData)}
                    </table>
                </div>
                
                <div class="section">
                    <h3>6. Docker Image ve Registry</h3>
                    <ul>
                        <li>Tüm servis image'ları registry.cbot.ai adresinden çekilir</li>
                        <li>Sunucular 443 portundan bu adrese erişebilmelidir</li>
                    </ul>
                    
                    <h4>Gerekli Containerlar:</h4>
                    <ul>
                        ${formData.coreModules.map(module => `<li>cbot-${module}</li>`).join('')}
                        ${formData.auxiliaryServices.map(service => `<li>cbot-${service.replace('_', '-')}</li>`).join('')}
                    </ul>
                </div>
                
                ${formData.ldapEnabled ? `
                <div class="section">
                    <h3>7. LDAP Gereksinimleri</h3>
                    <ul>
                        <li><strong>LDAP URL:</strong> ${formData.ldapDetails.url || 'Belirtilmedi'}</li>
                        <li><strong>BIND DN:</strong> ${formData.ldapDetails.bindDn || 'Belirtilmedi'}</li>
                        <li><strong>SEARCH BASE:</strong> ${formData.ldapDetails.searchBase || 'Belirtilmedi'}</li>
                        <li><strong>SEARCH FILTER:</strong> ${formData.ldapDetails.searchFilter || 'Belirtilmedi'}</li>
                    </ul>
                    <p>Email, Role, Name field'ları mapping yapılmalıdır.</p>
                    <p>Rollerin panelde LDAP ile birebir eşleşmesi gerekmektedir.</p>
                </div>
                ` : ''}
                
                ${formData.coreModules.includes('aiflow') || formData.auxiliaryServices.includes('hf_model_hosting') ? `
                <div class="section">
                    <h3>${formData.ldapEnabled ? '8' : '7'}. AI Servisleri Ek Gereksinimleri</h3>
                    ${formData.coreModules.includes('aiflow') ? `
                    <h4>AI Flow Gereksinimleri:</h4>
                    <ul>
                        <li>Minimum 10 Core CPU, 8 GB RAM</li>
                        ${formData.database === 'postgresql' ? '<li>4 GB disk alanı (PostgreSQL)</li>' : ''}
                    </ul>
                    ` : ''}
                    
                    ${formData.auxiliaryServices.includes('hf_model_hosting') ? `
                    <h4>HF Model Hosting Gereksinimleri:</h4>
                    <ul>
                        <li>GPU destekli sunucu</li>
                        <li>Minimum 16 GB VRAM</li>
                        <li>Minimum 32 GB sistem RAM</li>
                    </ul>
                    ` : ''}
                </div>
                ` : ''}
                
                <div class="section">
                    <h3>${formData.ldapEnabled || formData.coreModules.includes('aiflow') || formData.auxiliaryServices.includes('hf_model_hosting') ? '9' : '7'}. Kurulum Topolojisi</h3>
                    <p>Kurulum topolojisi görsel temsili AI asistan tarafından oluşturulmuştur.</p>
                    <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 4px;">
                        <p style="font-style: italic;">Bu demo sürümünde kurulum topolojisi görseli mevcut değildir.</p>
                    </div>
                </div>
            </div>
        `;
        
        return requirementsHtml;
    }

    function generateHardwareRequirements(formData) {
        let html = '<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">';
        html += `
            <tr>
                <th>Ortam</th>
                <th>CPU</th>
                <th>RAM</th>
                <th>Disk</th>
                <th>GPU</th>
                <th>OS</th>
            </tr>
        `;
        
        // Calculate hardware requirements based on selected modules
        let cpuTest = 4, cpuLive = 8;
        let ramTest = 8, ramLive = 16;
        let diskTest = 40, diskLive = 80;
        let gpu = 'Gerekmiyor';
        
        // Adjust based on modules
        if (formData.coreModules.includes('classifier')) {
            cpuTest += 4;
            cpuLive += 8;
            ramTest += 8;
            ramLive += 16;
        }
        
        if (formData.coreModules.includes('aiflow')) {
            cpuTest += 6;
            cpuLive += 10;
            ramTest += 8;
            ramLive += 16;
            diskTest += 20;
            diskLive += 40;
        }
        
        if (formData.auxiliaryServices.includes('ocr')) {
            cpuTest += 2;
            cpuLive += 4;
            ramTest += 4;
            ramLive += 8;
        }
        
        if (formData.auxiliaryServices.includes('hf_model_hosting')) {
            gpu = 'Minimum 16 GB VRAM';
            ramTest += 16;
            ramLive += 32;
        }
        
        // Add test environment row if needed
        if (formData.environment === 'test' || formData.environment === 'both') {
            html += `
                <tr>
                    <td>Test</td>
                    <td>${cpuTest} Core</td>
                    <td>${ramTest} GB</td>
                    <td>${diskTest} GB</td>
                    <td>${gpu}</td>
                    <td>CentOS 7/8 veya RHEL</td>
                </tr>
            `;
        }
        
        // Add live environment row if needed
        if (formData.environment === 'live' || formData.environment === 'both') {
            html += `
                <tr>
                    <td>Canlı</td>
                    <td>${cpuLive} Core</td>
                    <td>${ramLive} GB</td>
                    <td>${diskLive} GB</td>
                    <td>${gpu}</td>
                    <td>CentOS 7/8 veya RHEL</td>
                </tr>
            `;
        }
        
        html += '</table>';
        return html;
    }

    function generateDatabaseRequirements(formData) {
        let html = '<ul>';
        
        html += `<li><strong>Veritabanı Tipi:</strong> ${getDatabaseName(formData.database)}</li>`;
        html += '<li><strong>Kullanıcı:</strong> OWNER yetkili kullanıcı</li>';
        
        if (formData.database === 'mssql') {
            html += '<li><strong>Collation:</strong> SQL_Latin1_General_CP1_CI_AS</li>';
        }
        
        html += '<li><strong>Port:</strong> ' + getDatabasePort(formData.database) + '</li>';
        html += '<li>IP ve port paylaşımı zorunludur</li>';
        
        // Add module-specific warnings
        if (formData.coreModules.includes('classifier') && formData.database !== 'mssql') {
            html += '<li class="warning"><strong>Uyarı:</strong> Classifier modülü sadece MSSQL ile çalışır</li>';
        }
        
        if (formData.coreModules.includes('aiflow') && formData.database === 'postgresql') {
            html += '<li>AI Flow için PostgreSQL kullanımında minimum 4 GB disk alanı gerekir</li>';
        }
        
        html += '</ul>';
        return html;
    }

    function generateDnsRecords(formData) {
        let html = '';
        
        // Only add records for selected modules
        if (formData.coreModules.includes('panel')) {
            html += `
                <tr>
                    <td>Panel</td>
                    <td>cbot-panel${formData.environment === 'test' ? '-test' : ''}</td>
                    <td>3000</td>
                </tr>
            `;
            
            if (formData.environment === 'both') {
                html += `
                    <tr>
                        <td>Panel (Test)</td>
                        <td>cbot-panel-test</td>
                        <td>3000</td>
                    </tr>
                `;
            }
        }
        
        if (formData.coreModules.includes('fusion')) {
            html += `
                <tr>
                    <td>Fusion</td>
                    <td>cbot-fusion${formData.environment === 'test' ? '-test' : ''}</td>
                    <td>9600</td>
                </tr>
            `;
            
            if (formData.environment === 'both') {
                html += `
                    <tr>
                        <td>Fusion (Test)</td>
                        <td>cbot-fusion-test</td>
                        <td>9600</td>
                    </tr>
                `;
            }
        }
        
        if (formData.coreModules.includes('core')) {
            html += `
                <tr>
                    <td>Core</td>
                    <td>cbot-core${formData.environment === 'test' ? '-test' : ''}</td>
                    <td>5351</td>
                </tr>
            `;
            
            if (formData.environment === 'both') {
                html += `
                    <tr>
                        <td>Core (Test)</td>
                        <td>cbot-core-test</td>
                        <td>5351</td>
                    </tr>
                `;
            }
            
            html += `
                <tr>
                    <td>Socket</td>
                    <td>cbot-socket${formData.environment === 'test' ? '-test' : ''}</td>
                    <td>5000 (WebSocket)</td>
                </tr>
            `;
            
            if (formData.environment === 'both') {
                html += `
                    <tr>
                        <td>Socket (Test)</td>
                        <td>cbot-socket-test</td>
                        <td>5000 (WebSocket)</td>
                    </tr>
                `;
            }
        }
        
        return html;
    }

    function getDatabaseName(dbCode) {
        const dbNames = {
            'mongodb': 'MongoDB',
            'mssql': 'Microsoft SQL Server',
            'postgresql': 'PostgreSQL'
        };
        return dbNames[dbCode] || dbCode;
    }

    function getDatabasePort(dbCode) {
        const dbPorts = {
            'mongodb': '27017',
            'mssql': '1433',
            'postgresql': '5432'
        };
        return dbPorts[dbCode] || '';
    }

    function downloadPdf() {
        // In a real implementation, this would call the backend API to generate a PDF file
        alert('Bu demo sürümünde PDF indirme özelliği aktif değildir.');
    }

    function downloadWord() {
        // In a real implementation, this would call the backend API to generate a Word file
        alert('Bu demo sürümünde Word indirme özelliği aktif değildir.');
    }
});