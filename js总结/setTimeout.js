 //延迟定时器的正确用法
 var secondObjVal = secondObj.text();
        function secondCounter() {
            var secondTimer = setTimeout(function() {
                secondObjVal--;
                secondObj.text(secondObjVal);
                secondCounter();
            }, 1000);
            if (secondObjVal == 0) {
                clearTimeout(secondTimer);
                $('#loadingButton').text('重新获取校验码');
                $('#loadingButton').removeClass('disabled').addClass('btn-primary');
            }
        }
        secondCounter();
       	/**
 * New node file
 */
