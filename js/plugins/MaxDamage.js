//=============================================================================
// MaxDamage.js
//=============================================================================

/*:ja
 * @plugindesc 戦闘で使用するスキルごとに与える最大ダメージ制限を付与することが可能
 * @author tanisobe
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * 
 * skillのメモ欄に<max_damage: 10>と書くとそのskillでは最大10しかダメージを与えられない。
 */

(function() {
  Game_Action.prototype.makeDamageValue = function(target, critical) {
      var item = this.item();
      var baseValue = this.evalDamageFormula(target);
      var value = baseValue * this.calcElementRate(target);
      if (this.isPhysical()) {
          value *= target.pdr;
      }
      if (this.isMagical()) {
          value *= target.mdr;
      }
      if (baseValue < 0) {
          value *= target.rec;
      }
      if (critical) {
          value = this.applyCritical(value);
      }
      if (item.meta.max_damage) {
      }
      value = this.applyVariance(value, item.damage.variance);
      value = this.applyGuard(value, target);
      value = Math.round(value);
      var max_damage = item.meta.max_damage
      return (max_damage && value > Number(max_damage))? Number(max_damage) : value
      }
})();
