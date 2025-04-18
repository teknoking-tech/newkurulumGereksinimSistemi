// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const editButtons = document.querySelectorAll('.edit-btn');
    const editModuleModal = document.getElementById('editModuleModal');
    const closeModalBtn = document.querySelector('#editModuleModal .close');
    const cancelBtn = document.querySelector('#editModuleModal .cancel-btn');
    const editModuleForm = document.getElementById('editModuleForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button and content
            button.classList.add('active');
            document.getElementById(tabId + 'Tab').classList.add('active');
        });
    });
    
    // Edit module modal
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the module card
            const moduleCard = button.closest('.module-card') || button.closest('.db-card');
            
            if (moduleCard) {
                // Get module name from header
                const moduleName = moduleCard.querySelector('h3').textContent;
                
                // Fill form with module data
                document.getElementById('moduleId').value = moduleName.toLowerCase();
                
                if (moduleCard.classList.contains('module-card')) {
                    // Get module description
                    const descriptionText = moduleCard.querySelector('.module-body p').textContent.replace('Açıklama:', '').trim();
                    document.getElementById('moduleDescription').value = descriptionText;
                    
                    // Get CPU, RAM, Disk specs for test environment
                    const testCPU = moduleCard.querySelector('.spec-group:first-child p:nth-child(2)').textContent.match(/\d+/)[0];
                    const testRAM = moduleCard.querySelector('.spec-group:first-child p:nth-child(3)').textContent.match(/\d+/)[0];
                    const testDisk = moduleCard.querySelector('.spec-group:first-child p:nth-child(4)').textContent.match(/\d+/)[0];
                    
                    // Get CPU, RAM, Disk specs for live environment
                    const liveCPU = moduleCard.querySelector('.spec-group:last-child p:nth-child(2)').textContent.match(/\d+/)[0];
                    const liveRAM = moduleCard.querySelector('.spec-group:last-child p:nth-child(3)').textContent.match(/\d+/)[0];
                    const liveDisk = moduleCard.querySelector('.spec-group:last-child p:nth-child(4)').textContent.match(/\d+/)[0];
                    
                    // Set values in form
                    document.getElementById('cpuTest').value = testCPU;
                    document.getElementById('ramTest').value = testRAM;
                    document.getElementById('diskTest').value = testDisk;
                    document.getElementById('cpuLive').value = liveCPU;
                    document.getElementById('ramLive').value = liveRAM;
                    document.getElementById('diskLive').value = liveDisk;
                }
                
                // Show modal
                editModuleModal.style.display = 'block';
            }
        });
    });
    
    // Close modal
    function closeModal() {
        editModuleModal.style.display = 'none';
    }
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Click outside to close
    window.addEventListener('click', (e) => {
        if (e.target === editModuleModal) {
            closeModal();
        }
    });
    
    // Form submission
    editModuleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const moduleId = document.getElementById('moduleId').value;
        const description = document.getElementById('moduleDescription').value;
        const cpuTest = document.getElementById('cpuTest').value;
        const ramTest = document.getElementById('ramTest').value;
        const diskTest = document.getElementById('diskTest').value;
        const cpuLive = document.getElementById('cpuLive').value;
        const ramLive = document.getElementById('ramLive').value;
        const diskLive = document.getElementById('diskLive').value;
        
        // In a real application, this would send data to the backend API
        // For this demo, we'll just update the UI
        updateModuleCard(moduleId, {
            description,
            cpuTest,
            ramTest,
            diskTest,
            cpuLive,
            ramLive,
            diskLive
        });
        
        // Close modal
        closeModal();
        
        // Show success message
        alert('Modül başarıyla güncellendi!');
    });
    
    // Update module card in UI
    function updateModuleCard(moduleId, data) {
        // Find the module card
        const moduleName = moduleId.charAt(0).toUpperCase() + moduleId.slice(1);
        const moduleCards = document.querySelectorAll('.module-card');
        
        moduleCards.forEach(card => {
            const cardName = card.querySelector('h3').textContent;
            if (cardName === moduleName) {
                // Update description
                card.querySelector('.module-body p').textContent = 'Açıklama: ' + data.description;
                
                // Update test environment specs
                const testSpecGroup = card.querySelector('.spec-group:first-child');
                testSpecGroup.querySelector('p:nth-child(2)').innerHTML = `<i class="fas fa-microchip"></i> ${data.cpuTest} Core CPU`;
                testSpecGroup.querySelector('p:nth-child(3)').innerHTML = `<i class="fas fa-memory"></i> ${data.ramTest} GB RAM`;
                testSpecGroup.querySelector('p:nth-child(4)').innerHTML = `<i class="fas fa-hdd"></i> ${data.diskTest} GB Disk`;
                
                // Update live environment specs
                const liveSpecGroup = card.querySelector('.spec-group:last-child');
                liveSpecGroup.querySelector('p:nth-child(2)').innerHTML = `<i class="fas fa-microchip"></i> ${data.cpuLive} Core CPU`;
                liveSpecGroup.querySelector('p:nth-child(3)').innerHTML = `<i class="fas fa-memory"></i> ${data.ramLive} GB RAM`;
                liveSpecGroup.querySelector('p:nth-child(4)').innerHTML = `<i class="fas fa-hdd"></i> ${data.diskLive} GB Disk`;
            }
        });
    }
    
    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        // In a real application, this would send a logout request to the backend API
        // For this demo, we'll just redirect to the main page
        window.location.href = 'index.html';
    });
    
    // Requirements table filtering and search
    const searchInput = document.getElementById('searchRequirements');
    const dateFilter = document.getElementById('dateFilter');
    const moduleFilter = document.getElementById('moduleFilter');
    
    if (searchInput && dateFilter && moduleFilter) {
        const filterRequirements = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const dateOption = dateFilter.value;
            const moduleOption = moduleFilter.value;
            
            const tableRows = document.querySelectorAll('.requirements-table tbody tr');
            
            tableRows.forEach(row => {
                const id = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
                const date = row.querySelector('td:nth-child(2)').textContent;
                const environment = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                const modules = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
                const database = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
                
                let showRow = true;
                
                // Search term filter
                if (searchTerm) {
                    showRow = id.includes(searchTerm) || 
                              environment.includes(searchTerm) || 
                              modules.includes(searchTerm) || 
                              database.includes(searchTerm);
                }
                
                // Date filter (simplified for demo)
                if (showRow && dateOption !== 'all') {
                    // In a real application, this would check the actual date
                    // For this demo, we'll just show or hide some rows
                    if (dateOption === 'today' && !date.includes('18.04.2025')) {
                        showRow = false;
                    } else if (dateOption === 'week' && date.includes('16.04.2025')) {
                        showRow = false;
                    }
                }
                
                // Module filter
                if (showRow && moduleOption !== 'all') {
                    showRow = modules.includes(moduleOption);
                }
                
                // Show or hide row
                row.style.display = showRow ? '' : 'none';
            });
        };
        
        // Add event listeners
        searchInput.addEventListener('input', filterRequirements);
        dateFilter.addEventListener('change', filterRequirements);
        moduleFilter.addEventListener('change', filterRequirements);
    }
    
    // View, download, delete buttons in requirements table
    const viewButtons = document.querySelectorAll('.view-btn');
    const downloadButtons = document.querySelectorAll('.download-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const row = button.closest('tr');
            const reqId = row.querySelector('td:first-child').textContent;
            
            // In a real application, this would open a modal with requirement details
            // For this demo, we'll just show an alert
            alert(`Gereksinim Dokümanı Görüntüleniyor: ${reqId}`);
        });
    });
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const row = button.closest('tr');
            const reqId = row.querySelector('td:first-child').textContent;
            
            // In a real application, this would download the document
            // For this demo, we'll just show an alert
            alert(`Gereksinim Dokümanı İndiriliyor: ${reqId}`);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const row = button.closest('tr');
            const reqId = row.querySelector('td:first-child').textContent;
            
            // Confirm deletion
            if (confirm(`"${reqId}" gereksinim dokümanını silmek istediğinizden emin misiniz?`)) {
                // In a real application, this would send a delete request to the backend API
                // For this demo, we'll just remove the row
                row.remove();
                alert(`Gereksinim Dokümanı Silindi: ${reqId}`);
            }
        });
    });
});