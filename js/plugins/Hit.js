//=============================================================================
// Hit.js
//=============================================================================

/*:ja
 * @plugindesc 戦闘での物理攻撃の命中演算を変更
 * @author tanisobe
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * 
 * skillのメモ欄に<require_atk: 10>, <min_hitrate:50 >とatkが最低10以上ないと命中せず
 * atkが最低値の10で命中率50％として計算する。require_atkよりatkが多い分だけ命中率は増加する。
 * また敵の物理回避率は一切無視する。
 */

(function() {
  Game_Action.prototype.itemHit = function(target) {
      if (this.isPhysical()) {
          var require_atk = Number(this.item().meta.require_atk)
          var min_hitrate = Number(this.item().meta.min_hitrate)
          if(require_atk && min_hitrate) {
              if (this.subject().atk >= require_atk){
                  return (min_hitrate + this.subject().atk - require_atk + this.subject().tp/5) * 0.01 * this.subject().hit;
              } else {
                  return 0
              }
          }else{
              return this.item().meta.successRate * 0.01 * this.subject().hit;
          }
      } else {
          return this.item().successRate * 0.01;
      }
  };
})();
